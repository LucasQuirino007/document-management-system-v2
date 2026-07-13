import { useState, useEffect } from 'react';
import UploadComponent from '../components/UploadComponent';
import DocumentList from '../components/DocumentList';
import { listDocuments } from '../services/apiService';

export default function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    listDocuments()
      .then(setDocuments)
      .catch((err) => setLoadError(err.message));
  }, []);

  function handleUploadSuccess(newDocument) {
    setDocuments((prev) => [newDocument, ...prev]);
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Document Management System</h1>
      <UploadComponent onUploadSuccess={handleUploadSuccess} />
      <hr />
      {loadError ? (
        <p role="alert" style={{ color: 'red' }}>
          Erro ao carregar documentos: {loadError}
        </p>
      ) : (
        <DocumentList documents={documents} />
      )}
    </main>
  );
}
