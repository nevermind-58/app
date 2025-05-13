const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://your-frontend-url.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Apply auth middleware to all API routes
app.use('/api', auth);

// Routes
app.use('/api/timeline', require('./routes/timelineRoutes'));
app.use('/api/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/comments', require('./routes/commRoutes'));
app.use('/api/timeline', require('./routes/timelineRoutes'));
app.use('/api/memorable', require('./routes/memorableRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));

// Add static directory for uploaded files
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));