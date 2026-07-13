import { useState } from 'react';
import { downloadDocument } from '../services/documentsApi';

export default function DownloadButton({ documentId, fileName }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  async function handleDownload() {
    setError('');
    setIsDownloading(true);

    try {
      await downloadDocument(documentId, fileName);
    } catch (downloadError) {
      setError(downloadError.message || 'Nao foi possivel baixar o documento.');
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex w-full items-center justify-center rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
      >
        {isDownloading ? 'Baixando...' : 'Download'}
      </button>
      {error ? (
        <p
          role="alert"
          className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
