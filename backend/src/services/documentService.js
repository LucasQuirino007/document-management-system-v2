// Serviço de documentos: concentra as regras de negócio.
// Não conhece detalhes HTTP nem de persistência física.

const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const repository = require('../repositories/documentRepository');
const { STORAGE_DIR } = require('../config/storage');

// Expressão regular que aceita apenas UUIDs v4 — evita path traversal.
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidId(id) {
  return UUID_REGEX.test(id);
}

function createDocument(file, owner) {
  const document = {
    id: file.filename, // filename já é um UUID gerado pelo multer
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: owner || 'anonymous',
  };
  return repository.save(document);
}

function listDocuments() {
  return repository.findAll();
}

function getDocumentFile(id) {
  if (!isValidId(id)) {
    const err = new Error('ID de documento inválido');
    err.status = 400;
    throw err;
  }

  const document = repository.findById(id);
  if (!document) {
    const err = new Error('Documento não encontrado');
    err.status = 404;
    throw err;
  }

  // path.join com STORAGE_DIR garante que o arquivo está dentro do diretório
  // permitido, eliminando tentativas de path traversal.
  const filePath = path.join(STORAGE_DIR, id);

  if (!filePath.startsWith(STORAGE_DIR)) {
    const err = new Error('Acesso negado');
    err.status = 403;
    throw err;
  }

  if (!fs.existsSync(filePath)) {
    const err = new Error('Arquivo não encontrado no armazenamento');
    err.status = 404;
    throw err;
  }

  return { document, filePath };
}

module.exports = { createDocument, listDocuments, getDocumentFile };
