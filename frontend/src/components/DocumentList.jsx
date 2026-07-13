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
      <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
        <h2 className="font-display text-lg font-semibold text-slate-800">Documentos</h2>
        <p className="mt-2 text-sm text-slate-600">Nenhum documento enviado ate o momento.</p>
      </section>
    );
  }

  return (
    <section>
      <ul className="grid gap-4 sm:grid-cols-2">
        {documents.map((documentItem) => (
          <li
            key={documentItem.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md"
          >
            <p className="truncate text-base font-semibold text-slate-900" title={documentItem.originalName}>
              {documentItem.originalName}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Responsavel: {documentItem.owner || 'anonymous'}
            </p>
            <p className="mt-0.5 text-sm text-slate-600">Tamanho: {formatFileSize(documentItem.size)}</p>

            <div className="mt-3">
              <DownloadButton documentId={documentItem.id} fileName={documentItem.originalName} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
