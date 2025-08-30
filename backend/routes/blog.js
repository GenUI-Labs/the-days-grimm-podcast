const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');

const router = express.Router();

// Simple in-memory cache for Reddit results
const redditCache = new Map(); // key -> { ts: number, payload: any }
const BLOG_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

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
// Fetches Reddit posts via RSS feed (more reliable than JSON API)
// Returns a simplified, safe JSON payload for the frontend.
router.get('/reddit', async (req, res) => {
  try {
    const rawSubreddit = process.env.REDDIT_SUBREDDIT || '';
    const subreddit = rawSubreddit.replace(/^\/?r\//i, '').trim();
    const envFlair = process.env.REDDIT_REQUIRED_FLAIR || 'Official Blog';
    const envAuthor = process.env.REDDIT_ALLOWED_AUTHOR || '';
    const limit = Math.min(parseInt(req.query.limit, 10) || 6, 25);

    // Allow query overrides for debugging/config without redeploying
    const requiredFlair = typeof req.query.flair === 'string' ? req.query.flair : envFlair;
    const allowedAuthor = typeof req.query.author === 'string' ? req.query.author : envAuthor;
    const debug = String(req.query.debug || '0') === '1';
    // Cache key includes config inputs that affect results
    const cacheKey = JSON.stringify({ subreddit, requiredFlair, allowedAuthor, limit });
    const cached = redditCache.get(cacheKey);
    if (cached && (Date.now() - cached.ts) < BLOG_CACHE_TTL) {
      res.set('Cache-Control', `public, max-age=${Math.floor(BLOG_CACHE_TTL / 1000)}`);
      return res.json(cached.payload);
    }


    if (!subreddit) {
      return res.status(400).json({
        error: 'Missing configuration',
        message: 'REDDIT_SUBREDDIT is not configured on the server',
        posts: []
      });
    }

    // Use RSS feed instead of JSON API for better reliability
    let url;
    if (requiredFlair) {
      // RSS search with flair (may not work as effectively as JSON, but more reliable)
      const encodedFlair = encodeURIComponent(`flair:"${requiredFlair}"`);
      url = `https://www.reddit.com/r/${subreddit}/search.rss?q=${encodedFlair}&restrict_sr=1&sort=new&limit=${limit}`;
    } else {
      // Fallback to latest posts RSS
      url = `https://www.reddit.com/r/${subreddit}.rss?limit=${limit}`;
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      },
      timeout: 15000,
      validateStatus: function (status) {
        return status < 500;
      }
    });

    // Parse RSS feed instead of JSON
    const allPosts = await parseRedditRSS(response.data);

    // Filter posts by author if specified (RSS doesn't support flair filtering as effectively)
    let filteredPosts = allPosts;
    if (allowedAuthor) {
      filteredPosts = allPosts.filter(post => 
        String(post.author).toLowerCase() === String(allowedAuthor).toLowerCase()
      );
    }
    
    // Limit results
    const posts = filteredPosts.slice(0, limit);

    const payload = {
      posts,
      debug: debug ? {
        request: { subreddit, requiredFlair, allowedAuthor, limit, url },
        rssStatus: response.status,
        totalPosts: allPosts.length,
        filteredCount: filteredPosts.length,
        finalCount: posts.length,
        feedType: 'RSS',
        sample: posts.slice(0, 3).map(post => ({
          id: post.id,
          title: post.title?.substring(0, 50) + '...',
          author: post.author
        }))
      } : undefined
    };

    // Store in cache and set cache headers
    redditCache.set(cacheKey, { ts: Date.now(), payload });
    res.set('Cache-Control', `public, max-age=${Math.floor(BLOG_CACHE_TTL / 1000)}`);
    res.json(payload);
  } catch (error) {
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { message: error.message };
    
    // Enhanced error logging for debugging
    console.error('Reddit API Error Details:', {
      status: status,
      url: error?.config?.url || 'unknown',
      responseType: typeof data,
      isHTML: typeof data === 'string' && data.includes('<html'),
      errorMessage: error.message,
      subreddit: process.env.REDDIT_SUBREDDIT,
      requiredFlair: process.env.REDDIT_REQUIRED_FLAIR
    });
    
    res.status(status).json({
      error: 'Failed to fetch posts from Reddit',
      message: status === 403 ? 'Reddit blocked the request (403 Forbidden)' : (data?.message || error.message),
      debug: {
        status,
        subreddit: process.env.REDDIT_SUBREDDIT?.replace(/^\/?r\//i, '').trim(),
        isHTMLResponse: typeof data === 'string' && data.includes('<html')
      },
      posts: []
    });
  }
});

module.exports = router;


