const express = require('express');
const router = express.Router();
const MemorableMoment = require('../models/MemorableMoment');
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

// Get all memorable moments
router.get('/', async (req, res) => {
  try {
    const moments = await MemorableMoment.find();
    res.json(moments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a single memorable moment
router.get('/:id', async (req, res) => {
  try {
    const moment = await MemorableMoment.findById(req.params.id);
    if (!moment) {
      return res.status(404).json({ message: 'Moment not found' });
    }
    res.json(moment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new memorable moment
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    
    const newMoment = new MemorableMoment({
      title,
      date,
      description
    });
    
    if (req.file) {
      // Add server URL to image path for frontend use
      const serverUrl = process.env.SERVER_URL || 'https://beb-backend.onrender.com';
      newMoment.imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
    }
    
    const savedMoment = await newMoment.save();
    res.json(savedMoment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a memorable moment
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    
    const momentToUpdate = await MemorableMoment.findById(req.params.id);
    if (!momentToUpdate) {
      return res.status(404).json({ message: 'Moment not found' });
    }
    
    momentToUpdate.title = title;
    momentToUpdate.date = date;
    momentToUpdate.description = description;
    
    if (req.file) {
      // Delete old image if exists
      if (momentToUpdate.imageUrl) {
        const oldImage = momentToUpdate.imageUrl.split('/').pop();
        const imagePath = path.join(__dirname, '../uploads', oldImage);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      // Add server URL to image path for frontend use
      const serverUrl = process.env.SERVER_URL || 'https://beb-backend.onrender.com';
      momentToUpdate.imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
    }
    
    const updatedMoment = await momentToUpdate.save();
    res.json(updatedMoment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a memorable moment
router.delete('/:id', async (req, res) => {
  try {
    const moment = await MemorableMoment.findById(req.params.id);
    if (!moment) {
      return res.status(404).json({ message: 'Moment not found' });
    }
    
    // Delete image if exists
    if (moment.imageUrl) {
      const image = moment.imageUrl.split('/').pop();
      const imagePath = path.join(__dirname, '../uploads', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await MemorableMoment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Moment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;