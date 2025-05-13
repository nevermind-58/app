const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    enum: ['Deepak', 'Chaitanya'],
    required: true
  },
  wishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wishlist',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);