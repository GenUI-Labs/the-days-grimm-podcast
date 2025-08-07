# The Days Grimm Backend API

Backend server for The Days Grimm Podcast website, providing API endpoints for Printful integration, blog functionality, and episode tracking.

## Features

- **Printful API Proxy**: Handles CORS issues and provides secure access to Printful merchandise API
- **Blog System**: Placeholder endpoints for future blog functionality
- **Episode Tracking**: Placeholder endpoints for YouTube/Spotify integration
- **CORS Support**: Configured to work with the React frontend

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   - Copy `env.example` to `.env`
   - Add your Printful API key:
     ```
     PRINTFUL_API_KEY=your_actual_api_key_here
     ```

3. **Start the server**:
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on port 3001 by default.

## API Endpoints

### Health Check
- `GET /api/health` - Server status check

### Printful Integration
- `GET /api/printful/products` - Get all products
- `GET /api/printful/products/:id` - Get specific product
- `POST /api/printful/products` - Create new product
- `PUT /api/printful/products/:id` - Update product
- `DELETE /api/printful/products/:id` - Delete product
- `GET /api/printful/catalog` - Get catalog products

### Blog (Future Implementation)
- `GET /api/blog/posts` - Get all blog posts
- `GET /api/blog/posts/:id` - Get specific blog post

### Episodes (Future Implementation)
- `GET /api/episodes` - Get all episodes
- `GET /api/episodes/latest` - Get latest episode

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3001) | No |
| `PRINTFUL_API_KEY` | Printful API key | Yes (for merch) |
| `DATABASE_URL` | Database connection string | No (future) |
| `YOUTUBE_API_KEY` | YouTube API key | No (future) |
| `SPOTIFY_CLIENT_ID` | Spotify client ID | No (future) |
| `SPOTIFY_CLIENT_SECRET` | Spotify client secret | No (future) |

## Development

The backend is set up to work seamlessly with the React frontend:

- **CORS**: Configured to allow requests from `localhost:5173` and `localhost:5174`
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Logging**: Console logging for debugging and monitoring

## Future Enhancements

1. **Database Integration**: Add MongoDB/PostgreSQL for blog posts and user data
2. **Authentication**: JWT-based authentication for admin features
3. **Episode Tracking**: Automated episode detection from YouTube/Spotify
4. **Image Upload**: File upload functionality for blog images
5. **Email Integration**: Newsletter signup and email notifications
6. **Analytics**: Track website usage and podcast performance

## Troubleshooting

### CORS Issues
- Ensure the frontend is running on the allowed origins (localhost:5173 or 5174)
- Check that the backend is running on port 3001

### Printful API Issues
- Verify your API key is correctly set in the `.env` file
- Check that your Printful account has the necessary permissions
- Review the Printful API documentation for endpoint requirements

### Port Conflicts
- If port 3001 is in use, change the `PORT` environment variable
- Update the frontend API calls to match the new port
