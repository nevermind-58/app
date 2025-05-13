const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    enum: ['Deepak', 'Chaitanya']
  },
  color: {
    type: String,
    default: '#fff8b8' // Default yellow color
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', NoteSchema);