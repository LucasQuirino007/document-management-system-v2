const fs = require('node:fs');
const crypto = require('node:crypto');
const documentsRepository = require('../repositories/documents.repository');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function registerUploadedDocument(file, owner = 'anonymous') {
  if (!file) {
    throw createError('Arquivo nao enviado.', 400);
  }

  const metadata = {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    filename: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    path: file.path,
    owner,
    uploadedAt: new Date().toISOString(),
  };

  return documentsRepository.save(metadata);
}

function getAllDocuments() {
  return documentsRepository.listAll();
}

function getDocumentDownloadPayload(documentId) {
  if (!documentId) {
    throw createError('ID do documento e obrigatorio.', 400);
  }

  const document = documentsRepository.findById(documentId);

  if (!document) {
    throw createError('Documento nao encontrado.', 404);
  }

  if (!fs.existsSync(document.path)) {
    throw createError('Arquivo do documento nao encontrado no storage.', 404);
  }

  return {
    filePath: document.path,
    downloadName: document.originalName,
  };
}

module.exports = {
  registerUploadedDocument,
  getAllDocuments,
  getDocumentDownloadPayload,
};
