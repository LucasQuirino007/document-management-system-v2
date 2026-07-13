import DownloadButton from './DownloadButton';

export default function DocumentList({ documents }) {
  if (documents.length === 0) {
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <section>
      <h2>Documentos</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tamanho</th>
            <th>Enviado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.originalName}</td>
              <td>{(doc.size / 1024).toFixed(1)} KB</td>
              <td>{new Date(doc.uploadedAt).toLocaleString('pt-BR')}</td>
              <td>
                <DownloadButton document={doc} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
