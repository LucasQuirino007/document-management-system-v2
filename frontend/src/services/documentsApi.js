const API_PREFIX = '/api';

async function parseErrorMessage(response) {
  try {
    const data = await response.json();
    if (data?.error) {
      return data.error;
    }
  } catch (error) {
    // Ignora falha de parse e usa fallback abaixo.
  }

  return `Falha na requisicao (${response.status}).`;
}

async function request(path, options = {}, responseType = 'json') {
  const response = await fetch(`${API_PREFIX}${path}`, options);

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (responseType === 'response') {
    return response;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function uploadDocument({ file, owner }) {
  if (!file) {
    throw new Error('Selecione um arquivo antes de enviar.');
  }

  const formData = new FormData();
  formData.append('document', file);
  formData.append('owner', owner?.trim() || 'anonymous');

  return request('/upload', {
    method: 'POST',
    body: formData,
  });
}

export function listDocuments() {
  return request('/documents');
}

function extractFileName(contentDispositionHeader) {
  if (!contentDispositionHeader) {
    return null;
  }

  const utf8FileNameMatch = contentDispositionHeader.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8FileNameMatch?.[1]) {
    return decodeURIComponent(utf8FileNameMatch[1]);
  }

  const fileNameMatch = contentDispositionHeader.match(/filename="?([^";]+)"?/i);
  return fileNameMatch?.[1] || null;
}

export async function downloadDocument(documentId, fallbackName = 'documento') {
  if (!documentId) {
    throw new Error('Documento invalido para download.');
  }

  const response = await request(`/documents/${documentId}/download`, {}, 'response');
  const blob = await response.blob();

  const contentDisposition = response.headers.get('content-disposition');
  const fileName = extractFileName(contentDisposition) || fallbackName;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}
