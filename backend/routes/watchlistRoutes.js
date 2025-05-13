const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all watchlist entries
router.get('/', async (req, res) => {
  try {
    const items = await Watchlist.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new watchlist entry
router.post('/', async (req, res) => {
  try {
    const newItem = new Watchlist(req.body);
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a watchlist entry
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Watchlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a watchlist entry
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Watchlist.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;