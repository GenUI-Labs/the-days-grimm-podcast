const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Import routes
const episodesRouter = require('./routes/episodes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'], // Allow frontend origins
  credentials: true
}));
app.use(express.json());

// Printful API Configuration
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_BASE_URL = 'https://api.printful.com';

// Helper function to make Printful API requests
const makePrintfulRequest = async (endpoint, options = {}) => {
  if (!PRINTFUL_API_KEY) {
    throw new Error('Printful API key not configured');
  }

  try {
    const response = await axios({
      method: options.method || 'GET',
      url: `${PRINTFUL_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      data: options.data,
      params: options.params,
    });

    return response.data;
  } catch (error) {
    console.error('Printful API Error:', error.response?.data || error.message);
    throw new Error(`Printful API error: ${error.response?.status || 'Unknown error'}`);
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'The Days Grimm Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Printful API Proxy Endpoints

// Get all products
app.get('/api/printful/products', async (req, res) => {
  try {
    const data = await makePrintfulRequest('/store/products');
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to fetch products from Printful'
    });
  }
});

// Get specific product
app.get('/api/printful/products/:id', async (req, res) => {
  try {
    const data = await makePrintfulRequest(`/store/products/${req.params.id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to fetch product from Printful'
    });
  }
});

// Create product
app.post('/api/printful/products', async (req, res) => {
  try {
    const data = await makePrintfulRequest('/store/products', {
      method: 'POST',
      data: req.body
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to create product in Printful'
    });
  }
});

// Update product
app.put('/api/printful/products/:id', async (req, res) => {
  try {
    const data = await makePrintfulRequest(`/store/products/${req.params.id}`, {
      method: 'PUT',
      data: req.body
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to update product in Printful'
    });
  }
});

// Delete product
app.delete('/api/printful/products/:id', async (req, res) => {
  try {
    await makePrintfulRequest(`/store/products/${req.params.id}`, {
      method: 'DELETE'
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to delete product from Printful'
    });
  }
});

// Get catalog products (for creating new products)
app.get('/api/printful/catalog', async (req, res) => {
  try {
    const data = await makePrintfulRequest('/catalog/products');
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to fetch catalog from Printful'
    });
  }
});

// Blog endpoints (placeholder for future implementation)
app.get('/api/blog/posts', (req, res) => {
  res.json({
    message: 'Blog posts endpoint - to be implemented',
    posts: []
  });
});

app.get('/api/blog/posts/:id', (req, res) => {
  res.json({
    message: 'Single blog post endpoint - to be implemented',
    post: null
  });
});

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
  console.log(`🛍️  Printful proxy: http://localhost:${PORT}/api/printful/products`);
  
  if (!PRINTFUL_API_KEY) {
    console.log('⚠️  Warning: PRINTFUL_API_KEY not configured');
  } else {
    console.log('✅ Printful API key configured');
  }
});
