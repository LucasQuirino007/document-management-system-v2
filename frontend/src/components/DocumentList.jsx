import DownloadButton from './DownloadButton';

function formatFileSize(sizeInBytes) {
  if (!Number.isFinite(sizeInBytes) || sizeInBytes < 0) {
    return '-';
  }

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  const kiloBytes = sizeInBytes / 1024;
  if (kiloBytes < 1024) {
    return `${kiloBytes.toFixed(1)} KB`;
  }

  const megaBytes = kiloBytes / 1024;
  return `${megaBytes.toFixed(1)} MB`;
}

export default function DocumentList({ documents }) {
  if (!documents.length) {
    return (
      <section>
        <h2>Documentos</h2>
        <p>Nenhum documento enviado ate o momento.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Documentos</h2>

      <ul style={{ paddingLeft: '1.2rem' }}>
        {documents.map((documentItem) => (
          <li key={documentItem.id} style={{ marginBottom: '1rem' }}>
            <p style={{ margin: 0 }}>
              <strong>{documentItem.originalName}</strong>
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              Owner: {documentItem.owner} | Tamanho: {formatFileSize(documentItem.size)}
            </p>

            <DownloadButton
              documentId={documentItem.id}
              fileName={documentItem.originalName}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
