// Repositório de documentos: mantém metadados em memória nesta fase inicial.
// Os arquivos físicos ficam no filesystem (gerenciados pelo multer).

const documents = new Map();

function save(document) {
  documents.set(document.id, document);
  return document;
}

function findAll() {
  return Array.from(documents.values());
}

function findById(id) {
  return documents.get(id) || null;
}

function remove(id) {
  return documents.delete(id);
}

module.exports = { save, findAll, findById, remove };
