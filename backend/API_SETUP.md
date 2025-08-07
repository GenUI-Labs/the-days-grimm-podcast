# API Setup Guide

## YouTube Data API v3 Setup

### 1. Get YouTube API Key

The podcast owner (Brian/Thomas) needs to:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Sign in** with the Google account linked to The Days Grimm YouTube channel
3. **Create a new project**: "The Days Grimm Website"
4. **Enable YouTube Data API v3**:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
5. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated key
6. **Restrict the API Key** (for security):
   - Click on the API key
   - Under "Application restrictions" → "HTTP referrers"
   - Add: `yourdomain.com/*` (or `localhost:3000/*` for development)
   - Under "API restrictions" → "Restrict key"
   - Select "YouTube Data API v3"
   - Click "Save"

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Printful API Configuration
PRINTFUL_API_KEY=your_printful_api_key_here

# YouTube Data API v3 Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. API Usage & Optimization

- **Quota**: 10,000 units/day (YouTube API v3)
- **Our Usage**: ~50 units per request
- **Cache Duration**: 7 days (since episodes are weekly)
- **Daily Limit**: ~200 requests (way more than needed)
- **Weekly Requests**: Only 1-2 requests per week

### 4. Endpoints

- `GET /api/episodes` - Get latest 4 episodes (cached for 7 days)
- `GET /api/episodes/health` - Check cache status and API health

### 5. Data Structure

Each episode includes:
- `id`: YouTube video ID
- `number`: Episode number (extracted from title or chronological)
- `title`: Video title
- `description`: First line of video description
- `date`: Formatted publish date
- `duration`: Formatted video duration
- `thumbnail`: High-quality thumbnail URL
- `viewCount`: Formatted view count
- `featured`: Boolean (true for latest episode)
- `youtubeUrl`: Direct link to video
- `spotifyUrl`: Manual platform link (null by default)
- `applePodcastUrl`: Manual platform link (null by default)

### 6. Platform Links Management

Since YouTube API doesn't provide Spotify/Apple Podcasts links, you'll need to:

1. **Manual Management**: Maintain a simple JSON file with episode-to-platform mappings
2. **Admin Interface**: Simple form to add platform links for new episodes
3. **Fallback**: If no platform link exists, link to YouTube

### 7. Testing

Test the API:
```bash
# Health check
curl http://localhost:5000/api/episodes/health

# Get episodes
curl http://localhost:5000/api/episodes
```
