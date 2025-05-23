const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const auth = require('./middleware/auth');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['https://beb-2rus.onrender.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-password']
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
app.use('/uploads', express.static(uploadsDir));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));