const documents = [];

function save(documentMetadata) {
  documents.push(documentMetadata);
  return documentMetadata;
}

function listAll() {
  return [...documents];
}

function findById(id) {
  return documents.find((document) => document.id === id);
}

module.exports = {
  save,
  listAll,
  findById,
};
