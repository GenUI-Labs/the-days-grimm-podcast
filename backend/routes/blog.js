const express = require('express');
const axios = require('axios');

const router = express.Router();

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
        'User-Agent': 'TheDaysGrimmSite/1.0 (+contact@thedaysgrimm.com)'
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
        thumbnail: d.thumbnail && d.thumbnail.startsWith('http') ? d.thumbnail : null
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

    res.json(payload);
  } catch (error) {
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { message: error.message };
    console.error('Reddit fetch error:', data);
    res.status(status).json({
      error: 'Failed to fetch posts from Reddit',
      message: data?.message || error.message,
      posts: []
    });
  }
});

module.exports = router;


