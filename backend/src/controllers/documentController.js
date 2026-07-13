// Controller de documentos: trata entrada/saída HTTP e delega ao serviço.

const service = require('../services/documentService');

function upload(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error('Nenhum arquivo enviado');
      err.status = 400;
      return next(err);
    }

    const owner = req.body.owner;
    const document = service.createDocument(req.file, owner);
    return res.status(201).json(document);
  } catch (err) {
    return next(err);
  }
}

function listDocuments(req, res, next) {
  try {
    const documents = service.listDocuments();
    return res.json(documents);
  } catch (err) {
    return next(err);
  }
}

function downloadDocument(req, res, next) {
  try {
    const { document, filePath } = service.getDocumentFile(req.params.id);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(document.originalName)}"`
    );
    return res.sendFile(filePath);
  } catch (err) {
    return next(err);
  }
}

module.exports = { upload, listDocuments, downloadDocument };
