const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  wish: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  creator: {
    type: String,
    enum: ['Deepak', 'Chaitanya']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wishlist', WishlistSchema);