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
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber-200/70 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur sm:p-8">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            Document Management System
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            Gestao de documentos com upload e download rapido
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Envie arquivos, consulte a lista e realize download dos documentos salvos de forma
            centralizada.
          </p>
        </header>

        <UploadComponent onUploadSuccess={handleUploadSuccess} />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-xl font-semibold text-slate-900">Documentos</h2>

            <button
              type="button"
              onClick={loadDocuments}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? 'Carregando...' : 'Atualizar lista'}
            </button>
          </div>

          {error ? (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </p>
          ) : null}

          {isLoading ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
              Carregando documentos...
            </div>
          ) : (
            <DocumentList documents={documents} />
          )}
        </section>
      </div>
    </main>
  );
}
