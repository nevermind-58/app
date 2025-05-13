const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// Get all wishlist items
router.get('/', async (req, res) => {
  try {
    const items = await Wishlist.find().sort({ priority: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new wishlist item
router.post('/', async (req, res) => {
  try {
    const newItem = new Wishlist({
      ...req.body,
      createdAt: new Date()
    });
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a wishlist item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Wishlist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
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

// Delete a wishlist item
router.delete('/:id', async (req, res) => {
  try {
    const result = await Wishlist.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;