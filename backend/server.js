const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const episodesRouter = require('./routes/episodes');
const blogRouter = require('./routes/blog');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost:3000')) {
      return callback(null, true);
    }
    
    // Allow Vercel deployments
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'The Days Grimm Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Blog router
app.use('/api/blog', blogRouter);

// Use episodes router
app.use('/api', episodesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 The Days Grimm Backend API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Blog API: http://localhost:${PORT}/api/blog`);
  console.log(`🎙️  Episodes API: http://localhost:${PORT}/api/episodes`);
});
