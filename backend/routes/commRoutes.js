const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a specific wish
router.get('/:wishId', async (req, res) => {
  try {
    const comments = await Comment.find({ wishId: req.params.wishId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new comment
router.post('/', async (req, res) => {
  try {
    const { text, creator, wishId } = req.body;
    
    const newComment = new Comment({
      text,
      creator,
      wishId,
      createdAt: new Date()
    });
    
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;