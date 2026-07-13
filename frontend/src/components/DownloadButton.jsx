import { getDownloadUrl } from '../services/apiService';

export default function DownloadButton({ document }) {
  return (
    <a
      href={getDownloadUrl(document.id)}
      download={document.originalName}
      aria-label={`Baixar ${document.originalName}`}
    >
      Baixar
    </a>
  );
}
