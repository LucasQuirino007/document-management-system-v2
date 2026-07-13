# DMS — Backend

API REST do Document Management System, construída com Node.js e Express.

## Tecnologias

- **Runtime**: Node.js (CommonJS)
- **Framework**: Express 5
- **Upload de arquivos**: multer (diskStorage local)
- **Testes**: runner nativo do Node (`node:test`)

## Arquitetura

O backend segue uma Clean Architecture simples organizada em quatro camadas dentro de `src/`:

```
src/
├── routes/         # Definição dos endpoints e delegação para controllers
├── controllers/    # Tratamento de entrada/saída HTTP e validação básica
├── services/       # Regras de negócio
├── repositories/   # Persistência (filesystem local + metadados em memória)
└── app.js          # Ponto de entrada da aplicação
```

Fluxo de dependência: `routes → controllers → services → repositories`.

## Endpoints

| Método | Rota                        | Descrição                       |
| ------ | --------------------------- | ------------------------------- |
| GET    | `/health`                   | Verificação de saúde da API     |
| POST   | `/upload`                   | Envio de um documento           |
| GET    | `/documents`                | Listagem de documentos          |
| GET    | `/documents/:id/download`   | Download de um documento        |

## Armazenamento

Os arquivos enviados são gravados em `backend/storage/` no filesystem local da aplicação. Os metadados (id, nome original, tamanho, data, dono) são mantidos em memória.

## Variáveis de ambiente

| Variável | Padrão | Descrição                |
| -------- | ------ | ------------------------ |
| `PORT`   | `3000` | Porta em que a API sobe  |

## Instalação

```bash
npm install
```

## Execução

### Desenvolvimento (com hot-reload)

```bash
npm run dev
```

### Produção

```bash
npm start
```

A API ficará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

## Testes

```bash
npm test
```

Os testes ficam em `test/` e utilizam o runner nativo do Node (`node:test`).
