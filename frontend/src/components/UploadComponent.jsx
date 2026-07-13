import { useState } from 'react';
import { uploadDocument } from '../services/apiService';

export default function UploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const document = await uploadDocument(file);
      setFile(null);
      e.target.reset();
      onUploadSuccess(document);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Enviar documento</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          aria-label="Selecionar arquivo"
          onChange={(e) => setFile(e.target.files[0] || null)}
          disabled={loading}
        />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Enviando…' : 'Enviar'}
        </button>
      </form>
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
    </section>
  );
}
