const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const { upload: uploadMiddleware } = require('../config/storage');
const controller = require('../controllers/documentController');

const router = Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' },
});

router.post('/upload', apiLimiter, uploadMiddleware.single('file'), controller.upload);
router.get('/documents', apiLimiter, controller.listDocuments);
router.get('/documents/:id/download', apiLimiter, controller.downloadDocument);

module.exports = router;
