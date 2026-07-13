# DMS — Frontend

Interface web do Document Management System, construída com React e Vite.

## Tecnologias

- **Framework**: React 19 (ESM)
- **Build tool**: Vite 8
- **Estilização**: Tailwind CSS
- **Comunicação com o backend**: `fetch` via prefixo `/api` (proxy do Vite)

## Estrutura

```
src/
├── components/     # Componentes reutilizáveis (UploadComponent, DocumentList, DownloadButton…)
├── pages/          # Páginas da aplicação
├── services/       # Camada de acesso à API do backend
├── App.jsx         # Componente raiz
└── main.jsx        # Ponto de entrada da aplicação
```

## Pré-requisitos

- Node.js >= 24

## Instalação

```bash
npm install
```

## Execução

### Desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

Durante o desenvolvimento, chamadas para `/api/*` são redirecionadas automaticamente para `http://localhost:3000` (backend local) pelo proxy configurado no Vite.

### Build de produção

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist/`.

### Pré-visualização do build

```bash
npm run preview
```

Sobe um servidor local para inspecionar o build de produção.

## Proxy de desenvolvimento

O Vite está configurado para redirecionar requisições com prefixo `/api` para o backend:

```
/api/... → http://localhost:3000/...
```

Certifique-se de que o backend está em execução antes de iniciar o frontend em modo de desenvolvimento.
