const { Router } = require('express');
const { upload: uploadMiddleware } = require('../config/storage');
const controller = require('../controllers/documentController');

const router = Router();

router.post('/upload', uploadMiddleware.single('file'), controller.upload);
router.get('/documents', controller.listDocuments);
router.get('/documents/:id/download', controller.downloadDocument);

module.exports = router;
