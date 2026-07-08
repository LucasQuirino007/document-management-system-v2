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
      <button type="button" onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? 'Baixando...' : 'Download'}
      </button>
      {error ? <p style={{ color: '#b00020' }}>{error}</p> : null}
    </div>
  );
}
