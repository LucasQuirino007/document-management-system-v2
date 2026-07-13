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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold text-slate-900">Upload de Documento</h2>
        <p className="mt-1 text-sm text-slate-600">
          Informe o responsavel e selecione o arquivo para armazenamento.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 sm:items-end">
        <div className="sm:col-span-1">
          <label htmlFor="owner" className="mb-1.5 block text-sm font-medium text-slate-700">
            Responsavel
          </label>
          <input
            id="owner"
            name="owner"
            type="text"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="Ex.: equipe-financeira"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="document" className="mb-1.5 block text-sm font-medium text-slate-700">
            Arquivo
          </label>
          <input
            id="document"
            name="document"
            type="file"
            ref={fileInputRef}
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-brand-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar documento'}
          </button>
        </div>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p
          role="status"
          className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          {success}
        </p>
      ) : null}
    </section>
  );
}
