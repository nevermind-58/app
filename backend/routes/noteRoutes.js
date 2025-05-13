const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // Newest first
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new note
router.post('/', async (req, res) => {
  try {
    const { content, author, color } = req.body;
    
    const newNote = new Note({
      content,
      author,
      color
    });
    
    const savedNote = await newNote.save();
    res.json(savedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const { content, author, color } = req.body;
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id, 
      { content, author, color },
      { new: true } // Return the updated document
    );
    
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;