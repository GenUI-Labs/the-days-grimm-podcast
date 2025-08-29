const express = require('express');
const axios = require('axios');

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

// GET /api/blog/reddit
// Proxies Reddit search for posts with a specific flair in a subreddit and
// returns a simplified, safe JSON payload for the frontend.
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

    let url;
    if (requiredFlair) {
      const encodedFlair = encodeURIComponent(`flair_name:\"${requiredFlair}\"`);
      url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodedFlair}&restrict_sr=1&sort=new&limit=${limit}`;
    } else {
      // Fallback to latest posts if no flair filtering requested
      url = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheDaysGrimmPodcast/1.0; +https://thedaysgrimmpodcast.com)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
      timeout: 10000,
      validateStatus: function (status) {
        return status < 500; // Resolve only if status is less than 500
      }
    });

    const children = response?.data?.data?.children || [];

    const afterFlair = children
      .map((child) => child.data)
      .filter((d) => !!d)
      .filter((d) => {
        // Safety net: ensure flair matches
        const flairName = d.link_flair_text || d.author_flair_text || '';
        if (requiredFlair && !String(flairName).toLowerCase().includes(String(requiredFlair).toLowerCase())) {
          return false;
        }
        // Optional author pinning
        if (allowedAuthor && String(d.author).toLowerCase() !== String(allowedAuthor).toLowerCase()) {
          return false;
        }
        return true;
      })

    const posts = afterFlair
      .map((d) => ({
        id: d.id,
        title: d.title,
        selftext: d.selftext || '',
        url: `https://www.reddit.com${d.permalink}`,
        createdUtc: d.created_utc,
        author: d.author,
        flair: d.link_flair_text || d.author_flair_text || null,
        thumbnail: pickBestThumbnail(d)
      }));

    const payload = { posts };
    if (debug) {
      Object.assign(payload, {
        debug: {
          request: { subreddit, requiredFlair, allowedAuthor, limit, url },
          redditStatus: response?.status,
          totalChildren: children.length,
          filteredCount: posts.length,
          sample: (children.slice(0, 5).map((c) => ({
            id: c?.data?.id,
            title: c?.data?.title,
            flair: c?.data?.link_flair_text || c?.data?.author_flair_text || null,
            author: c?.data?.author,
          })) || [])
        }
      });
    }

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


