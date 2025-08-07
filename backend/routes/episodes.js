const express = require('express');
const { google } = require('googleapis');

const router = express.Router();
const youtube = google.youtube('v3');

// Cache configuration
let episodesCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const FALLBACK_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Helper function to format duration
const formatDuration = (duration) => {
  if (!duration || typeof duration !== 'string') {
    return '0:00';
  }

  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) {
    return '0:00';
  }

  const hours = (match[1] || '').replace('H', '') || '';
  const minutes = (match[2] || '').replace('M', '') || '0';
  const seconds = (match[3] || '').replace('S', '') || '0';

  let result = '';
  if (hours) result += `${hours}:`;
  result += `${minutes.toString().padStart(2, '0')}:`;
  result += seconds.toString().padStart(2, '0');

  return result;
};

// Helper function to check if we need to refresh cache
const shouldRefreshCache = () => {
  if (!episodesCache || !cacheTimestamp) return true;
  
  const timeSinceLastCache = Date.now() - cacheTimestamp;
  return timeSinceLastCache > CACHE_DURATION;
};

// Helper: derive custom name from a YouTube URL (supports /c/Name and /@Handle)
const deriveCustomFromUrl = (urlString) => {
  if (!urlString) return null;
  try {
    const u = new URL(urlString);
    const parts = u.pathname.split('/').filter(Boolean);
    // handle /@Handle
    if (parts[0] && parts[0].startsWith('@')) {
      return parts[0].slice(1);
    }
    // handle /c/CustomName
    const idx = parts.indexOf('c');
    if (idx >= 0 && parts[idx + 1]) {
      return parts[idx + 1];
    }
    return null;
  } catch {
    return null;
  }
};

// Resolve channelId with multiple strategies
const resolveChannelId = async () => {
  // 1) Direct channel id from env
  if (process.env.YOUTUBE_CHANNEL_ID) {
    return process.env.YOUTUBE_CHANNEL_ID;
  }

  // 2) Custom channel username from env
  const customFromEnv = process.env.YOUTUBE_CHANNEL_CUSTOM
    || deriveCustomFromUrl(process.env.YOUTUBE_CHANNEL_URL);
  if (customFromEnv) {
    const byUsername = await youtube.channels.list({
      key: process.env.YOUTUBE_API_KEY,
      forUsername: customFromEnv,
      part: 'id',
      maxResults: 1
    });
    const found = byUsername.data.items?.[0]?.id;
    if (found) return found;
  }

  // 3) Fallback: search by name
  const searchTerms = [
    'The Days Grimm Podcast',
    'The Days Grimm'
  ];
  for (const q of searchTerms) {
    const resp = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      q,
      type: 'channel',
      part: 'id',
      maxResults: 1
    });
    const cid = resp.data.items?.[0]?.id?.channelId;
    if (cid) return cid;
  }

  throw new Error('Unable to resolve YouTube channel id. Provide YOUTUBE_CHANNEL_ID or YOUTUBE_CHANNEL_CUSTOM.');
};

// Helper: extract episode number token as it appears in the title
const getEpisodeNumber = (title) => {
  if (!title) return '';
  // Prefer hashtags like #224
  const hashMatch = title.match(/#\s*\d+/);
  if (hashMatch) {
    return hashMatch[0].replace(/\s+/g, '');
  }
  // Then phrases like Episode 224 or EP 224
  const epMatch = title.match(/(?:episode|ep)\s*#?\s*\d+/i);
  if (epMatch) {
    return epMatch[0].trim();
  }
  return '';
};

// Helper: parse ISO8601 duration into seconds
const parseDurationSeconds = (duration) => {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
};

// Main episodes endpoint
router.get('/episodes', async (req, res) => {
  try {
    // Check if we have valid cache
    if (!shouldRefreshCache()) {
      console.log('Serving episodes from cache');
      return res.json(episodesCache);
    }

    console.log('Fetching fresh episodes from YouTube API');

    // Determine channel ID (prefer env; supports custom URL/username fallback)
    const channelId = await resolveChannelId();

    // Fetch latest videos (request more to allow filtering out Shorts)
    const searchResponse = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      channelId: channelId,
      part: 'snippet',
      order: 'date',
      maxResults: 10, // Request more; we'll filter Shorts then take 4
      type: 'video'
    });

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      throw new Error('No videos found');
    }

    // Get detailed video info
    const orderedIds = searchResponse.data.items.map(item => item.id.videoId);
    const videoIds = orderedIds.join(',');
    const videoDetailsResponse = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      part: 'snippet,contentDetails,statistics,liveStreamingDetails',
      id: videoIds
    });

    // Map videoId -> order index to preserve search order after filtering
    const orderIndex = new Map(orderedIds.map((id, idx) => [id, idx]));

    // Transform and filter out Shorts (duration < 60s or title contains #shorts)
    let episodes = (videoDetailsResponse.data.items || [])
      .map((video) => {
        const durationIso = video.contentDetails?.duration;
        const durationSeconds = parseDurationSeconds(durationIso);
        const title = video.snippet.title || '';
        const isShort = durationSeconds > 0 && durationSeconds < 60;
        const hasShortsTag = /#shorts/i.test(title);
        const liveState = video.snippet?.liveBroadcastContent || 'none';
        const isUpcoming = liveState === 'upcoming' || durationSeconds === 0;
        return {
          id: video.id,
          order: orderIndex.get(video.id) ?? 9999,
          number: getEpisodeNumber(title),
          title,
          description: (video.snippet.description || '').split('\n')[0],
          date: new Date((isUpcoming && video.liveStreamingDetails?.scheduledStartTime)
            ? video.liveStreamingDetails.scheduledStartTime
            : video.snippet.publishedAt
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          duration: formatDuration(durationIso),
          durationSeconds,
          thumbnail: (video.snippet.thumbnails?.maxres?.url
            || video.snippet.thumbnails?.standard?.url
            || video.snippet.thumbnails?.high?.url
            || video.snippet.thumbnails?.medium?.url
            || video.snippet.thumbnails?.default?.url
            || ''),
          viewCount: parseInt(video.statistics?.viewCount || 0).toLocaleString(),
          youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
          // Platform links - these would need to be manually maintained
          spotifyUrl: null,
          applePodcastUrl: null,
          isShort: isShort || hasShortsTag,
          isUpcoming
        };
      })
      .filter(v => !v.isShort)
      .sort((a, b) => a.order - b.order)
      .slice(0, 4);

    // Mark first item as featured
    episodes = episodes.map((ep, idx) => ({ ...ep, featured: idx === 0 }));

    // Update cache
    episodesCache = episodes;
    cacheTimestamp = Date.now();

    console.log(`Cached ${episodes.length} episodes for 7 days`);
    res.json(episodes);

  } catch (error) {
    console.error('Error fetching episodes:', error);
    
    // If we have fallback cache, serve it
    if (episodesCache && (Date.now() - cacheTimestamp) < FALLBACK_CACHE_DURATION) {
      console.log('Serving fallback cache due to API error');
      return res.json(episodesCache);
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch episodes',
      message: error.message 
    });
  }
});

// Health check endpoint
router.get('/episodes/health', (req, res) => {
  const cacheAge = episodesCache ? Date.now() - cacheTimestamp : null;
  const cacheAgeHours = cacheAge ? Math.round(cacheAge / (1000 * 60 * 60)) : null;
  
  res.json({
    status: 'healthy',
    cacheStatus: episodesCache ? 'valid' : 'empty',
    cacheAge: cacheAgeHours ? `${cacheAgeHours} hours` : 'N/A',
    episodeCount: episodesCache ? episodesCache.length : 0,
    shouldRefresh: shouldRefreshCache()
  });
});

module.exports = router;
