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
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  let result = '';
  if (hours) result += `${hours}:`;
  result += `${minutes.padStart(2, '0')}:`;
  result += seconds.padStart(2, '0');
  
  return result;
};

// Helper function to check if we need to refresh cache
const shouldRefreshCache = () => {
  if (!episodesCache || !cacheTimestamp) return true;
  
  const timeSinceLastCache = Date.now() - cacheTimestamp;
  return timeSinceLastCache > CACHE_DURATION;
};

// Helper function to get episode number from title or date
const getEpisodeNumber = (title, publishedAt, index) => {
  // Try to extract episode number from title (e.g., "Episode 123" or "#123")
  const episodeMatch = title.match(/(?:episode|#)\s*(\d+)/i);
  if (episodeMatch) {
    return `Episode ${episodeMatch[1]}`;
  }
  
  // Fallback: use reverse chronological order
  return `Episode ${index + 1}`;
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

    // Get channel ID first (if not already known)
    const channelResponse = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      q: 'The Days Grimm Podcast',
      type: 'channel',
      part: 'snippet',
      maxResults: 1
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error('Channel not found');
    }

    const channelId = channelResponse.data.items[0].snippet.channelId;

    // Fetch latest videos
    const searchResponse = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      channelId: channelId,
      part: 'snippet',
      order: 'date',
      maxResults: 4, // Latest episode + 3 recent
      type: 'video'
    });

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      throw new Error('No videos found');
    }

    // Get detailed video info
    const videoIds = searchResponse.data.items.map(item => item.id.videoId);
    const videoDetailsResponse = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      part: 'snippet,contentDetails,statistics',
      id: videoIds.join(',')
    });

    // Transform data to match frontend structure
    const episodes = videoDetailsResponse.data.items.map((video, index) => ({
      id: video.id,
      number: getEpisodeNumber(video.snippet.title, video.snippet.publishedAt, index),
      title: video.snippet.title,
      description: video.snippet.description.split('\n')[0], // First line only
      date: new Date(video.snippet.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      duration: formatDuration(video.contentDetails.duration),
      thumbnail: video.snippet.thumbnails.high.url,
      viewCount: parseInt(video.statistics.viewCount || 0).toLocaleString(),
      featured: index === 0, // First video is featured
      youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
      // Platform links - these would need to be manually maintained
      spotifyUrl: null,
      applePodcastUrl: null
    }));

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
