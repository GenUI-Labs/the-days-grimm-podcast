#!/usr/bin/env node

/**
 * Test Utility for The Days Grimm API Endpoints
 * 
 * This script allows you to manually test YouTube and Reddit API calls
 * to debug issues and verify data responses.
 * 
 * Usage:
 *   node test-apis.js youtube
 *   node test-apis.js reddit
 *   node test-apis.js both
 */

const { google } = require('googleapis');
const fetch = require('node-fetch');
require('dotenv').config({ path: './backend/.env' });

const youtube = google.youtube('v3');

// Test YouTube API
async function testYouTubeAPI() {
  console.log('\n🎥 Testing YouTube API...\n');
  
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      console.log('❌ YOUTUBE_API_KEY not found in environment variables');
      return;
    }

    console.log('✅ API Key found');
    
    // First, resolve channel ID
    let channelId = process.env.YOUTUBE_CHANNEL_ID;
    
    if (!channelId) {
      console.log('🔍 No YOUTUBE_CHANNEL_ID provided, searching for channel...');
      
      const searchResponse = await youtube.search.list({
        key: process.env.YOUTUBE_API_KEY,
        q: 'The Days Grimm Podcast',
        type: 'channel',
        part: 'snippet',
        maxResults: 1
      });

      if (searchResponse.data.items?.length > 0) {
        channelId = searchResponse.data.items[0].snippet.channelId;
        console.log(`📺 Found channel ID: ${channelId}`);
      } else {
        console.log('❌ Could not find The Days Grimm channel');
        return;
      }
    }

    // Get latest videos
    console.log('\n📋 Fetching latest videos...');
    
    const tenWeeksAgo = new Date();
    tenWeeksAgo.setDate(tenWeeksAgo.getDate() - (10 * 7));
    const publishedAfter = tenWeeksAgo.toISOString();

    const searchResponse = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      channelId: channelId,
      part: 'snippet',
      order: 'date',
      maxResults: 10,
      type: 'video',
      publishedAfter: publishedAfter
    });

    const videoIds = searchResponse.data.items?.map(item => item.id.videoId).filter(Boolean) || [];
    
    if (videoIds.length === 0) {
      console.log('❌ No videos found in the last 10 weeks');
      return;
    }

    console.log(`📹 Found ${videoIds.length} videos`);

    // Get detailed video information
    const videoDetailsResponse = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      id: videoIds.join(','),
      part: 'snippet,contentDetails,statistics,liveStreamingDetails'
    });

    console.log('\n📊 Latest Episodes Analysis:\n');
    
    videoDetailsResponse.data.items?.forEach((video, index) => {
      const description = video.snippet.description || '';
      const firstLine = description.split('\n')[0];
      const descriptionLength = description.length;
      const hasDescription = description.trim().length > 0;
      
      console.log(`${index + 1}. ${video.snippet.title}`);
      console.log(`   📅 Published: ${video.snippet.publishedAt}`);
      console.log(`   📝 Description Length: ${descriptionLength} characters`);
      console.log(`   📄 Has Description: ${hasDescription ? '✅' : '❌'}`);
      console.log(`   🏷️  First Line: "${firstLine}"`);
      console.log(`   🔗 URL: https://www.youtube.com/watch?v=${video.id}`);
      
      if (index === 0) {
        console.log(`\n🔍 LATEST EPISODE DETAILED ANALYSIS:`);
        console.log(`   Full Description Preview (first 200 chars):`);
        console.log(`   "${description.substring(0, 200)}${description.length > 200 ? '...' : ''}"`);
        console.log(`\n   First 5 lines:`);
        description.split('\n').slice(0, 5).forEach((line, i) => {
          console.log(`   Line ${i + 1}: "${line}"`);
        });
      }
      
      console.log(''); // Empty line for spacing
    });

  } catch (error) {
    console.log('❌ YouTube API Error:');
    console.log(`   Status: ${error.status || 'Unknown'}`);
    console.log(`   Message: ${error.message}`);
    if (error.errors) {
      error.errors.forEach(err => {
        console.log(`   - ${err.message} (${err.reason})`);
      });
    }
  }
}

// Test Reddit API
async function testRedditAPI() {
  console.log('\n🔴 Testing Reddit API...\n');
  
  try {
    const subreddit = 'thedaysgrimm';
    const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=10`;
    
    console.log(`📡 Fetching from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheDaysGrimmBot/1.0)'
      }
    });

    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    const posts = data?.data?.children || [];
    
    console.log(`📝 Found ${posts.length} recent posts\n`);
    
    posts.slice(0, 5).forEach((post, index) => {
      const postData = post.data;
      const hasText = postData.selftext && postData.selftext.trim().length > 0;
      const textLength = postData.selftext?.length || 0;
      
      console.log(`${index + 1}. ${postData.title}`);
      console.log(`   📅 Created: ${new Date(postData.created_utc * 1000).toLocaleString()}`);
      console.log(`   👤 Author: u/${postData.author}`);
      console.log(`   📝 Has Text: ${hasText ? '✅' : '❌'} (${textLength} chars)`);
      console.log(`   🔗 URL: https://reddit.com${postData.permalink}`);
      
      if (hasText) {
        console.log(`   📄 Preview: "${postData.selftext.substring(0, 100)}${textLength > 100 ? '...' : ''}"`);
      }
      
      console.log('');
    });

  } catch (error) {
    console.log('❌ Reddit API Error:');
    console.log(`   Message: ${error.message}`);
  }
}

// Test local backend endpoints
async function testLocalEndpoints() {
  console.log('\n🏠 Testing Local Backend Endpoints...\n');
  
  const endpoints = [
    'http://localhost:5000/api/episodes',
    'http://localhost:5000/api/blog'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing: ${endpoint}`);
      
      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success: ${response.status}`);
        
        if (endpoint.includes('episodes')) {
          console.log(`   📹 Episodes found: ${data.episodes?.length || 0}`);
          if (data.episodes?.[0]) {
            const latest = data.episodes[0];
            console.log(`   🏆 Latest: "${latest.title}"`);
            console.log(`   📝 Description: "${latest.description}"`);
            console.log(`   📅 Date: ${latest.date}`);
          }
        } else if (endpoint.includes('blog')) {
          console.log(`   📝 Posts found: ${data.posts?.length || 0}`);
        }
      } else {
        console.log(`❌ Failed: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.log(`❌ Connection Error: ${error.message}`);
    }
    
    console.log('');
  }
}

// Main execution
async function main() {
  const command = process.argv[2]?.toLowerCase();
  
  console.log('🧪 The Days Grimm API Test Utility');
  console.log('===================================');
  
  switch (command) {
    case 'youtube':
      await testYouTubeAPI();
      break;
      
    case 'reddit':
      await testRedditAPI();
      break;
      
    case 'local':
      await testLocalEndpoints();
      break;
      
    case 'both':
    case 'all':
      await testYouTubeAPI();
      await testRedditAPI();
      await testLocalEndpoints();
      break;
      
    default:
      console.log('\n📖 Usage:');
      console.log('  node test-apis.js youtube   - Test YouTube API only');
      console.log('  node test-apis.js reddit    - Test Reddit API only');
      console.log('  node test-apis.js local     - Test local backend endpoints');
      console.log('  node test-apis.js all       - Test all APIs');
      console.log('\n💡 Examples:');
      console.log('  node test-apis.js youtube   # Debug episode descriptions');
      console.log('  node test-apis.js reddit    # Check blog posts');
      console.log('  node test-apis.js all       # Full system test');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
