const documentsService = require('../services/documents.service');

function sendControllerError(res, error) {
  const statusCode = error.statusCode || 500;
  const message = statusCode >= 500 ? 'Erro interno ao processar a requisicao.' : error.message;

  return res.status(statusCode).json({
    error: message,
  });
}

function uploadDocument(req, res) {
  try {
    const owner = req.body?.owner || 'anonymous';
    const document = documentsService.registerUploadedDocument(req.file, owner);

    return res.status(201).json(document);
  } catch (error) {
    return sendControllerError(res, error);
  }
}

function listDocuments(req, res) {
  try {
    const documents = documentsService.getAllDocuments();
    return res.json(documents);
  } catch (error) {
    return sendControllerError(res, error);
  }
}

function downloadDocument(req, res) {
  try {
    const payload = documentsService.getDocumentDownloadPayload(req.params.id);
    return res.download(payload.filePath, payload.downloadName);
  } catch (error) {
    return sendControllerError(res, error);
  }
}

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
