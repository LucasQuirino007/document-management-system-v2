const path = require('path');
const multer = require('multer');
const { randomUUID } = require('crypto');

const STORAGE_DIR = path.resolve(
  process.env.STORAGE_DIR || path.join(__dirname, '../../storage')
);

const FILE_SIZE_LIMIT = parseInt(process.env.FILE_SIZE_LIMIT_MB || '10', 10) * 1024 * 1024;

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, STORAGE_DIR),
  filename: (_req, _file, cb) => cb(null, randomUUID()),
});

const upload = multer({
  storage: diskStorage,
  limits: { fileSize: FILE_SIZE_LIMIT },
});

module.exports = { upload, STORAGE_DIR };
