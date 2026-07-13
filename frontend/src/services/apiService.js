// Cliente de API: toda comunicação com o backend passa por aqui.
// O prefixo /api é interceptado pelo proxy do Vite em desenvolvimento.

const BASE_URL = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${res.status}`);
  }
  return res.json();
}

export async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);
  if (owner) formData.append('owner', owner);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(res);
}

export async function listDocuments() {
  const res = await fetch(`${BASE_URL}/documents`);
  return handleResponse(res);
}

export function getDownloadUrl(id) {
  return `${BASE_URL}/documents/${encodeURIComponent(id)}/download`;
}
