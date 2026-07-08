import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { listDocuments } from './services/documentsApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDocuments() {
    setError('');

    try {
      const documentList = await listDocuments();
      setDocuments(documentList);
    } catch (loadError) {
      setError(loadError.message || 'Nao foi possivel carregar os documentos.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  function handleUploadSuccess(createdDocument) {
    if (!createdDocument) {
      return;
    }

    setDocuments((currentDocuments) => [createdDocument, ...currentDocuments]);
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '52rem' }}>
      <h1>Document Management System</h1>
      <p>Envie arquivos, consulte a lista e realize download dos documentos salvos.</p>

      <UploadComponent onUploadSuccess={handleUploadSuccess} />

      <hr style={{ margin: '2rem 0' }} />

      <section style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={loadDocuments} disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Atualizar lista'}
        </button>
      </section>

      {error ? <p style={{ color: '#b00020' }}>{error}</p> : null}

      {isLoading ? <p>Carregando documentos...</p> : <DocumentList documents={documents} />}
    </main>
  );
}
