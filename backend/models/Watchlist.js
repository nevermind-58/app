const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['movie', 'show'],
    required: true
  },
  genre: {
    type: String
  },
  deepakWatched: {
    type: Boolean,
    default: false
  },
  chaitanyaWatched: {
    type: Boolean,
    default: false
  },
  deepakNotes: {
    type: String,
    default: ''
  },
  deepakNotesUpdatedAt: {
    type: Date
  },
  chaitanyaNotes: {
    type: String,
    default: ''
  },
  chaitanyaNotesUpdatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);