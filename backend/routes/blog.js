const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');

const router = express.Router();

// Simple in-memory cache for Reddit results
const redditCache = new Map(); // key -> { ts: number, payload: any }
const BLOG_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Utility: normalize Reddit username (remove /u/ prefix if present)
const normalizeUsername = (username) => {
  if (!username) return '';
  return String(username).replace(/^\/u\//i, '').toLowerCase();
};

// Utility: safely enhance RSS posts with thumbnails from JSON API
const enhanceWithThumbnails = async (posts, subreddit) => {
  if (!posts || posts.length === 0) return posts;
  
  try {
    console.log('🖼️ [THUMBNAIL] Attempting to enhance', posts.length, 'posts with thumbnails...');
    
    // Get JSON data for the subreddit 
    const jsonUrl = `https://www.reddit.com/r/${subreddit}/new.json?limit=25`;
    
    const jsonResponse = await axios.get(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheDaysGrimmPodcast/1.0; +https://thedaysgrimmpodcast.com)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 5000, // Quick timeout - this is just for thumbnails
      validateStatus: (status) => status < 500
    });
    
    const jsonPosts = jsonResponse?.data?.data?.children || [];
    console.log('🖼️ [THUMBNAIL] Found', jsonPosts.length, 'JSON posts for thumbnail matching');
    
    // Create a map of post ID to thumbnail
    const thumbnailMap = {};
    jsonPosts.forEach(child => {
      if (child?.data?.id) {
        const thumbnail = pickBestThumbnail(child.data);
        if (thumbnail) {
          thumbnailMap[child.data.id] = thumbnail;
        }
      }
    });
    
    console.log('🖼️ [THUMBNAIL] Created thumbnail map with', Object.keys(thumbnailMap).length, 'thumbnails');
    
    // Enhance posts with thumbnails
    const enhancedPosts = posts.map(post => ({
      ...post,
      thumbnail: thumbnailMap[post.id] || post.thumbnail || null
    }));
    
    const withThumbnails = enhancedPosts.filter(p => p.thumbnail).length;
    console.log('🖼️ [THUMBNAIL] Enhanced', withThumbnails, '/', posts.length, 'posts with thumbnails');
    
    return enhancedPosts;
    
  } catch (error) {
    console.log('⚠️ [THUMBNAIL] Enhancement failed, using RSS posts as-is:', error.message);
    return posts; // Return original posts if thumbnail enhancement fails
  }
};

// Utility: pick the best available thumbnail from a Reddit post payload
const pickBestThumbnail = (d) => {
  const unescape = (u) => (typeof u === 'string' ? u.replace(/&amp;/g, '&') : u);
  const isImageUrl = (u) => typeof u === 'string' && /\.(jpg|jpeg|png|webp|gif)(?:\?|$)/i.test(u);

  // 1) preview -> original source
  try {
    const src = d?.preview?.images?.[0]?.source?.url;
    if (src) return unescape(src);
  } catch {}

  // 2) preview -> pick the largest resolution if available
  try {
    const resolutions = d?.preview?.images?.[0]?.resolutions || [];
    if (resolutions.length > 0) {
      return unescape(resolutions[resolutions.length - 1].url);
    }
  } catch {}

  // 3) gallery/media_metadata
  try {
    const galleryItems = d?.gallery_data?.items;
    const mediaMeta = d?.media_metadata;
    if (galleryItems && mediaMeta) {
      const firstId = galleryItems[0]?.media_id;
      const meta = firstId ? mediaMeta[firstId] : null;
      const source = meta?.s?.u || (Array.isArray(meta?.p) ? meta.p[meta.p.length - 1]?.u : null);
      if (source) return unescape(source);
    }
  } catch {}

  // 4) direct url if it's an image
  if (isImageUrl(d?.url_overridden_by_dest)) return unescape(d.url_overridden_by_dest);
  if (isImageUrl(d?.url)) return unescape(d.url);

  // 5) fallback to thumbnail if it's a valid external URL (Reddit uses keywords like 'self', 'default', 'nsfw' otherwise)
  const t = d?.thumbnail;
  if (t && /^https?:\/\//i.test(t) && !['self', 'default', 'nsfw', 'image', 'spoiler'].includes(String(t).toLowerCase())) {
    return unescape(t);
  }

  return null;
};

// Helper function to parse Reddit RSS feed
const parseRedditRSS = (xmlData) => {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) return reject(err);
      
      try {
        const items = result?.feed?.entry || [];
        const parsedPosts = items.map(item => {
          const title = item.title?.[0] || '';
          const link = item.link?.[0]?.$.href || '';
          const author = item.author?.[0]?.name?.[0] || '';
          const updated = item.updated?.[0] || '';
          const content = item.content?.[0]?._ || item.content?.[0] || '';
          
          // Extract Reddit post ID from link
          const idMatch = link.match(/\/comments\/([a-z0-9]+)\//);
          const id = idMatch ? idMatch[1] : Math.random().toString(36).substr(2, 9);
          
          return {
            id,
            title: title.replace(/^r\/[^\/]+\s*-\s*/, ''), // Remove subreddit prefix
            selftext: content.replace(/<[^>]*>/g, '').substring(0, 500), // Strip HTML, limit length
            url: link,
            createdUtc: Math.floor(new Date(updated).getTime() / 1000),
            author,
            flair: null, // RSS doesn't include flair info
            thumbnail: null
          };
        });
        
        resolve(parsedPosts);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
};

// GET /api/blog/reddit
// Hybrid approach: tries RSS first, falls back to JSON API
// Returns a simplified, safe JSON payload for the frontend.
router.get('/reddit', async (req, res) => {
  console.log('🔍 [REDDIT API] Starting request...');
  try {
    const rawSubreddit = process.env.REDDIT_SUBREDDIT || '';
    const subreddit = rawSubreddit.replace(/^\/?r\//i, '').trim();
    const envFlair = process.env.REDDIT_REQUIRED_FLAIR || 'Official Blog';
    const envAuthor = process.env.REDDIT_ALLOWED_AUTHOR || '';
    const limit = Math.min(parseInt(req.query.limit, 10) || 6, 25);

    console.log('📋 [REDDIT API] Configuration:', {
      rawSubreddit,
      subreddit,
      envFlair,
      envAuthor,
      limit
    });

    // Allow query overrides for debugging/config without redeploying
    const requiredFlair = typeof req.query.flair === 'string' ? req.query.flair : envFlair;
    const allowedAuthor = typeof req.query.author === 'string' ? req.query.author : envAuthor;
    const debug = String(req.query.debug || '0') === '1';
    
    console.log('🔧 [REDDIT API] Final parameters:', {
      requiredFlair,
      allowedAuthor,
      debug,
      query: req.query
    });
    // Cache key includes config inputs that affect results
    const cacheKey = JSON.stringify({ subreddit, requiredFlair, allowedAuthor, limit });
    const cached = redditCache.get(cacheKey);
    if (cached && (Date.now() - cached.ts) < BLOG_CACHE_TTL) {
      console.log('💾 [REDDIT API] Serving from cache');
      res.set('Cache-Control', `public, max-age=${Math.floor(BLOG_CACHE_TTL / 1000)}`);
      return res.json(cached.payload);
    }

    if (!subreddit) {
      console.log('❌ [REDDIT API] Missing subreddit configuration');
      return res.status(400).json({
        error: 'Missing configuration',
        message: 'REDDIT_SUBREDDIT is not configured on the server',
        posts: []
      });
    }

    console.log('🚀 [REDDIT API] Proceeding with fresh request for subreddit:', subreddit);

    let posts = [];
    let apiMethod = 'unknown';

    // Try RSS first (more reliable in production)
    try {
      console.log('📡 [REDDIT API] Attempting RSS method...');
      let rssUrl;
      if (requiredFlair) {
        const encodedFlair = encodeURIComponent(`flair:"${requiredFlair}"`);
        rssUrl = `https://www.reddit.com/r/${subreddit}/search.rss?q=${encodedFlair}&restrict_sr=1&sort=new&limit=${limit}`;
      } else {
        rssUrl = `https://www.reddit.com/r/${subreddit}.rss?limit=${limit}`;
      }
      
      console.log('🔗 [REDDIT API] RSS URL:', rssUrl);

      const rssResponse = await axios.get(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000,
        validateStatus: (status) => status < 500
      });

      console.log('📥 [REDDIT API] RSS Response:', {
        status: rssResponse.status,
        statusText: rssResponse.statusText,
        contentType: rssResponse.headers['content-type'],
        dataLength: rssResponse.data?.length || 0,
        dataPreview: rssResponse.data?.substring(0, 200) + '...'
      });

      const allPosts = await parseRedditRSS(rssResponse.data);
      console.log('🔍 [REDDIT API] RSS parsed posts:', allPosts.length);
      
      // Filter by author if specified
      let filteredPosts = allPosts;
      if (allowedAuthor) {
        filteredPosts = allPosts.filter(post => 
          normalizeUsername(post.author) === normalizeUsername(allowedAuthor)
        );
        console.log('👤 [REDDIT API] After author filter:', filteredPosts.length, 'posts');
      }
      
      posts = filteredPosts.slice(0, limit);
      
      // Safely enhance with thumbnails from JSON API (non-breaking)
      posts = await enhanceWithThumbnails(posts, subreddit);
      
      apiMethod = 'RSS';
      console.log('✅ [REDDIT API] RSS Success! Final posts:', posts.length);
      
    } catch (rssError) {
      console.log('❌ [REDDIT API] RSS failed:', rssError.message);
      console.log('🔄 [REDDIT API] Attempting JSON fallback...');
      
      // RSS failed, try JSON API as fallback
      try {
        let jsonUrl;
        if (requiredFlair) {
          const encodedFlair = encodeURIComponent(`flair_name:"${requiredFlair}"`);
          jsonUrl = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodedFlair}&restrict_sr=1&sort=new&limit=${limit}`;
        } else {
          jsonUrl = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;
        }
        
        console.log('🔗 [REDDIT API] JSON URL:', jsonUrl);

        // Try multiple user agents as Reddit blocks some
        const userAgents = [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Mozilla/5.0 (compatible; TheDaysGrimmPodcast/1.0; +https://thedaysgrimmpodcast.com)',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ];
        
        let jsonResponse;
        let userAgentIndex = 0;
        
        while (userAgentIndex < userAgents.length) {
          try {
            console.log(`🤖 [REDDIT API] Trying user agent ${userAgentIndex + 1}/${userAgents.length}`);
            
            jsonResponse = await axios.get(jsonUrl, {
              headers: {
                'User-Agent': userAgents[userAgentIndex],
                'Accept': 'application/json, text/html, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'DNT': '1',
                'Upgrade-Insecure-Requests': '1'
              },
              timeout: 15000,
              maxRedirects: 5,
              validateStatus: (status) => status < 500
            });
            
            console.log(`✅ [REDDIT API] User agent ${userAgentIndex + 1} worked!`);
            break;
          } catch (uaError) {
            console.log(`❌ [REDDIT API] User agent ${userAgentIndex + 1} failed:`, uaError.message);
            userAgentIndex++;
            if (userAgentIndex >= userAgents.length) {
              throw uaError;
            }
          }
        }

        console.log('📥 [REDDIT API] JSON Response:', {
          status: jsonResponse.status,
          statusText: jsonResponse.statusText,
          contentType: jsonResponse.headers['content-type'],
          hasData: !!jsonResponse.data,
          dataKeys: jsonResponse.data ? Object.keys(jsonResponse.data) : []
        });

        const children = jsonResponse?.data?.data?.children || [];
        console.log('👶 [REDDIT API] JSON children found:', children.length);
        
        const afterFlair = children
          .map((child) => child.data)
          .filter((d) => !!d)
          .filter((d) => {
            // Flair filtering
            const flairName = d.link_flair_text || d.author_flair_text || '';
            const flairMatch = !requiredFlair || String(flairName).toLowerCase().includes(String(requiredFlair).toLowerCase());
            
            // Author filtering
            const authorMatch = !allowedAuthor || normalizeUsername(d.author) === normalizeUsername(allowedAuthor);
            
            console.log('🔍 [REDDIT API] Post filter check:', {
              title: d.title?.substring(0, 30) + '...',
              author: d.author,
              flair: flairName,
              flairMatch,
              authorMatch,
              passes: flairMatch && authorMatch
            });
            
            return flairMatch && authorMatch;
          });

        console.log('🎯 [REDDIT API] After filtering:', afterFlair.length, 'posts');

        posts = afterFlair
          .map((d) => ({
            id: d.id,
            title: d.title || '',
            selftext: d.selftext || '',
            url: d.url || `https://reddit.com${d.permalink}`,
            createdUtc: d.created_utc || 0,
            author: d.author || '',
            flair: d.link_flair_text || d.author_flair_text || null,
            thumbnail: pickBestThumbnail(d)
          }))
          .slice(0, limit);
          
        apiMethod = 'JSON';
        console.log('✅ [REDDIT API] JSON Success! Final posts:', posts.length);
        
      } catch (jsonError) {
        console.log('❌ [REDDIT API] JSON also failed:', jsonError.message);
        console.log('🔄 [REDDIT API] Trying direct RSS without flair as final fallback...');
        
        // Final fallback: Direct RSS without any filtering
        try {
          const fallbackUrl = `https://www.reddit.com/r/${subreddit}.rss?limit=${limit}`;
          console.log('🔗 [REDDIT API] Fallback RSS URL:', fallbackUrl);
          
          const fallbackResponse = await axios.get(fallbackUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              'Accept': 'application/rss+xml, application/xml, text/xml, */*',
              'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 20000,
            validateStatus: (status) => status < 500
          });
          
          console.log('📥 [REDDIT API] Fallback RSS Response:', {
            status: fallbackResponse.status,
            contentLength: fallbackResponse.data?.length || 0
          });
          
          const allFallbackPosts = await parseRedditRSS(fallbackResponse.data);
          console.log('🔍 [REDDIT API] Fallback RSS parsed posts:', allFallbackPosts.length);
          
          // Apply client-side filtering
          let filteredFallbackPosts = allFallbackPosts;
          if (allowedAuthor) {
            filteredFallbackPosts = allFallbackPosts.filter(post => 
              normalizeUsername(post.author) === normalizeUsername(allowedAuthor)
            );
            console.log('👤 [REDDIT API] Fallback after author filter:', filteredFallbackPosts.length, 'posts');
          }
          
          posts = filteredFallbackPosts.slice(0, limit);
          
          // Safely enhance with thumbnails from JSON API (non-breaking)
          posts = await enhanceWithThumbnails(posts, subreddit);
          
          apiMethod = 'RSS-Fallback';
          console.log('✅ [REDDIT API] Fallback RSS Success! Final posts:', posts.length);
          
        } catch (fallbackError) {
          console.log('❌ [REDDIT API] Fallback RSS also failed:', fallbackError.message);
          console.log('💥 [REDDIT API] ALL METHODS FAILED');
          throw new Error(`All methods failed. RSS: ${rssError.message}, JSON: ${jsonError.message}, Fallback: ${fallbackError.message}`);
        }
      }
    }

        const payload = {
      posts,
      debug: debug ? {
        request: { subreddit, requiredFlair, allowedAuthor, limit },
        apiMethod: apiMethod,
        postsFound: posts.length,
        sample: posts.slice(0, 3).map(post => ({
          id: post.id,
          title: post.title?.substring(0, 50) + '...',
          author: post.author
        }))
      } : undefined
    };

    console.log('📤 [REDDIT API] Final payload:', {
      postsCount: posts.length,
      method: apiMethod,
      cached: false,
      timestamp: new Date().toISOString()
    });

    // Store in cache and set cache headers
    redditCache.set(cacheKey, { ts: Date.now(), payload });
    res.set('Cache-Control', `public, max-age=${Math.floor(BLOG_CACHE_TTL / 1000)}`);
    console.log('✅ [REDDIT API] Request completed successfully');
    res.json(payload);
  } catch (error) {
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { message: error.message };

    // Enhanced error logging for debugging
    console.error('💀 [REDDIT API] FATAL ERROR:', {
      status: status,
      url: error?.config?.url || 'unknown',
      responseType: typeof data,
      isHTML: typeof data === 'string' && data.includes('<html'),
      errorMessage: error.message,
      errorStack: error.stack,
      subreddit: process.env.REDDIT_SUBREDDIT,
      requiredFlair: process.env.REDDIT_REQUIRED_FLAIR,
      fullError: error
    });

    res.status(status).json({
      error: 'Failed to fetch posts from Reddit',
      message: status === 403 ? 'Reddit blocked the request (403 Forbidden)' : (data?.message || error.message),
      debug: {
        status,
        subreddit: process.env.REDDIT_SUBREDDIT?.replace(/^\/?r\//i, '').trim(),
        isHTMLResponse: typeof data === 'string' && data.includes('<html'),
        timestamp: new Date().toISOString()
      },
      posts: []
    });
  }
});

module.exports = router;


