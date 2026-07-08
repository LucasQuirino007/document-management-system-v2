import { useRef, useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ onUploadSuccess }) {
  const [owner, setOwner] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Selecione um arquivo antes de enviar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdDocument = await uploadDocument({ file, owner });
      setSuccess('Documento enviado com sucesso.');
      setOwner('');
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUploadSuccess) {
        onUploadSuccess(createdDocument);
      }
    } catch (submitError) {
      setError(submitError.message || 'Nao foi possivel enviar o documento.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Upload de Documento</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="owner">Responsavel</label>
          <input
            id="owner"
            name="owner"
            type="text"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="Ex.: equipe-financeira"
            style={{ display: 'block', width: '100%', maxWidth: '24rem' }}
          />
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="document">Arquivo</label>
          <input
            id="document"
            name="document"
            type="file"
            ref={fileInputRef}
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            style={{ display: 'block', width: '100%', maxWidth: '24rem' }}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar documento'}
        </button>
      </form>

      {error ? <p style={{ color: '#b00020' }}>{error}</p> : null}
      {success ? <p style={{ color: '#0a7d33' }}>{success}</p> : null}
    </section>
  );
}
