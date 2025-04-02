// routes/assignments.js
const express = require('express');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const Assignment = require('../models/assignments'); // Adjust the path as necessary

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize GridFS
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'assignments'
  });
});

// Create assignment with file uploads
router.post('/', upload.array('attachments'), async (req, res) => {
  try {
    const { 
      title, 
      courseId, 
      instructorId,
      description, 
      dueDate, 
      totalPoints,
      enableAiGrading,
      enablePlagiarismCheck,
      published,
      submissionType,
      questions,
      rubric
    } = req.body;

    if (!instructorId) {
      return res.status(400).json({ error: 'Instructor ID is required' });
    }


    // Upload files to GridFS
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadStream = gfs.openUploadStream(file.originalname, {
          metadata: {
            assignmentTitle: title,
            uploadedBy: instructorId
          }
        });

        uploadStream.write(file.buffer);
        uploadStream.end();

        await new Promise((resolve, reject) => {
          uploadStream.on('finish', resolve);
          uploadStream.on('error', reject);
        });

        attachments.push({
          fileId: uploadStream.id,
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        });
      }
    }

    // Create assignment
    const assignment = new Assignment({
      title,
      courseId,
      instructorId,
      description,
      dueDate: new Date(dueDate),
      totalPoints: Number(totalPoints),
      enableAiGrading: enableAiGrading === 'true',
      enablePlagiarismCheck: enablePlagiarismCheck === 'true',
      published: published === 'true',
      submissionType,
      questions: JSON.parse(questions),
      rubric: JSON.parse(rubric),
      attachments
    });

    await assignment.save();

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Get file by ID
router.get('/file/:id', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfs.openDownloadStream(fileId);
    
    downloadStream.on('error', () => {
      res.status(404).json({ error: 'File not found' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(400).json({ error: 'Invalid file ID' });
  }
});

module.exports = router;