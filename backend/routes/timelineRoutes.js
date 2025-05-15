const express = require('express');
const router = express.Router();
const TimelineEvent = require('../models/TimelineEvent');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'));
    }
  }
});

// Get all timeline events
router.get('/', async (req, res) => {
  try {
    const events = await TimelineEvent.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a single timeline event
router.get('/:id', async (req, res) => {
  try {
    const event = await TimelineEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new timeline event
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    
    const newEvent = new TimelineEvent({
      title,
      date,
      description
    });
    
    if (req.file) {
      // Add server URL to image path for frontend use
      const serverUrl = process.env.SERVER_URL || 'https://beb-backend.onrender.com';
      newEvent.imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
    }
    
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a timeline event
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    
    const eventToUpdate = await TimelineEvent.findById(req.params.id);
    if (!eventToUpdate) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    eventToUpdate.title = title;
    eventToUpdate.date = date;
    eventToUpdate.description = description;
    
    if (req.file) {
      // Delete old image if exists
      if (eventToUpdate.imageUrl) {
        const oldImage = eventToUpdate.imageUrl.split('/').pop();
        const imagePath = path.join(__dirname, '../uploads', oldImage);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      // Add server URL to image path for frontend use
      const serverUrl = process.env.SERVER_URL || 'https://beb-backend.onrender.com';
      eventToUpdate.imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
    }
    
    const updatedEvent = await eventToUpdate.save();
    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a timeline event
router.delete('/:id', async (req, res) => {
  try {
    const event = await TimelineEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Delete image if exists
    if (event.imageUrl) {
      const image = event.imageUrl.split('/').pop();
      const imagePath = path.join(__dirname, '../uploads', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await TimelineEvent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;