# The Days Grimm Podcast Website

A full-stack web application for The Days Grimm Podcast, featuring a React frontend with TypeScript and a Node.js/Express backend.

## 🏗️ Project Structure

```
thedaysgrimm-react/
├── frontend/          # React + TypeScript + Vite application
│   ├── src/          # React source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Node.js + Express API server
│   ├── server.js     # Main server file
│   ├── .env          # Environment variables
│   └── package.json  # Backend dependencies
└── package.json      # Root package.json (monorepo)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example file in backend
   cd backend
   cp env.example .env
   # Edit .env and add your Printful API key
   ```

3. **Start both frontend and backend:**

   **Option A: Using npm (recommended)**
   ```bash
   npm run dev
   ```

   **Option B: Using npm-run-all (alternative)**
   ```bash
   npm run dev:parallel
   ```

   **Option C: Using Windows batch script**
   ```bash
   scripts/dev.bat
   ```

   **Option D: Using PowerShell script**
   ```bash
   scripts/dev.ps1
   ```

   **Option E: Manual (two terminals)**
   ```bash
   # Terminal 1 - Frontend
   npm run dev:frontend
   
   # Terminal 2 - Backend  
   npm run dev:backend
   ```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Individual Commands

### Frontend Only
```bash
npm run dev:frontend
```

### Backend Only
```bash
npm run dev:backend
```

### Build Frontend
```bash
npm run build
```

## 🔧 Features

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons
- **Glitch effect** for horror theme
- **Responsive design**

### Backend
- **Express.js** API server
- **CORS** enabled for frontend
- **Printful API** integration
- **Environment variable** management
- **Error handling** and logging
- **Future-ready** for blog and episode tracking

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Server status

### Printful Integration
- `GET /api/printful/products` - Get all products
- `GET /api/printful/products/:id` - Get specific product
- `POST /api/printful/products` - Create product
- `PUT /api/printful/products/:id` - Update product
- `DELETE /api/printful/products/:id` - Delete product
- `GET /api/printful/catalog` - Get catalog products

### Future Endpoints
- `GET /api/blog/posts` - Blog posts (coming soon)
- `GET /api/episodes` - Episode tracking (coming soon)

## 🔮 Future Enhancements

1. **Database Integration** - MongoDB/PostgreSQL for blog posts
2. **Authentication** - JWT-based admin system
3. **Episode Tracking** - YouTube/Spotify API integration
4. **Image Upload** - File upload for blog images
5. **Email Integration** - Newsletter signup
6. **Analytics** - Website and podcast performance tracking

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Environment Variables

**Backend (.env):**
```
PORT=5000
PRINTFUL_API_KEY=your_api_key_here
```

## 📝 Notes

- The frontend no longer needs the `VITE_PRINTFUL_API_KEY` environment variable since all Printful API calls go through the backend
- The backend handles CORS and API key management
- Both frontend and backend can be run independently or together using the root `npm run dev` command

## 🐛 Troubleshooting

### CORS Issues
- Ensure backend is running on port 5000
- Check that frontend is running on localhost:3000

### Printful API Issues
- Verify API key is set in `backend/.env`
- Check Printful account permissions
- Review backend console logs for detailed error messages

### Port Conflicts
- Change `PORT` in `backend/.env` if 5000 is in use
- Update frontend API calls if backend port changes
