const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const multer = require('multer');
const documentsController = require('../controllers/documents.controller');

const router = express.Router();
const storageDir = path.resolve(__dirname, '../../storage');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(storageDir, { recursive: true }, (error) => {
      cb(error, storageDir);
    });
  },
  filename: (req, file, cb) => {
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${sanitizedOriginalName}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('document'), documentsController.uploadDocument);
router.get('/documents', documentsController.listDocuments);
router.get('/documents/:id/download', documentsController.downloadDocument);

module.exports = router;
