# Especificação Completa - Document Management System (DMS)

> Documento de especificação funcional e tecnica para orientar a implementacao
> do DMS em etapas, com foco em simplicidade, evolucao incremental e aderencia a
> Clean Architecture simples no backend.

## 1. Objetivo

Entregar um sistema web simples para upload, listagem e download de documentos
por usuario, com armazenamento local de arquivos e metadados em memoria.

## 2. Escopo

### Dentro do escopo

- Upload de documentos via formulario web
- Persistencia fisica de arquivos no filesystem local da aplicacao
- Armazenamento de metadados em memoria (processo backend)
- Listagem de documentos com informacoes essenciais
- Download de documento por identificador
- Gestao simples por usuario via campo owner informado na requisicao
- API HTTP para integracao com frontend React via prefixo /api
- Endpoint de saude para verificacao de disponibilidade

### Fora do escopo

- Armazenamento externo (S3, GCS, Azure Blob ou similares)
- Banco de dados relacional ou NoSQL nesta fase
- Versionamento de documentos
- Controle de acesso robusto (autenticacao/autorizacao completas)
- Exclusao e edicao de documentos
- Paginacao, filtros avancados e busca textual
- Processamento assincrono de arquivos

## 3. Requisitos funcionais

| ID    | Requisito | Critério de aceite |
| ----- | --------- | ------------------ |
| RF-01 | O usuario pode enviar um documento | Dado um multipart/form-data com file valido e owner preenchido, quando chamar POST /upload, entao a API retorna 201 com metadado do documento e o arquivo e salvo em backend/storage |
| RF-02 | O sistema valida entrada de upload | Se file nao for enviado, retorna 400; se owner ausente ou vazio, retorna 400; se tipo nao permitido, retorna 415; se tamanho exceder limite configurado, retorna 413 |
| RF-03 | O usuario pode listar documentos | Ao chamar GET /documents, a API retorna 200 com array de metadados; se nao houver documentos, retorna array vazio |
| RF-04 | A listagem possui ordenacao previsivel | A lista deve ser ordenada por uploadedAt em ordem decrescente (mais recente primeiro) |
| RF-05 | O usuario pode baixar um documento por id | Ao chamar GET /documents/:id/download com id existente e arquivo presente, retorna 200 com stream binario e cabecalho Content-Disposition usando originalName |
| RF-06 | O sistema trata id inexistente no download | Se o id nao existir nos metadados, retorna 404 com payload de erro padronizado |
| RF-07 | O sistema trata arquivo faltando em disco | Se metadado existir, mas arquivo nao for encontrado no backend/storage, retorna 404 com payload de erro padronizado |
| RF-08 | O sistema expoe endpoint de saude | GET /health retorna 200 com status ok para monitoramento basico |
| RF-09 | O identificador de documento e unico | Cada upload gera id unico para evitar colisoes entre documentos |
| RF-10 | O frontend consome API pelo prefixo /api | As chamadas de frontend devem apontar para /api/upload, /api/documents e /api/documents/:id/download via proxy do Vite |

## 4. Requisitos nao funcionais

| ID     | Requisito |
| ------ | --------- |
| RNF-01 | Arquivos devem ser gravados exclusivamente no filesystem local usando multer com diskStorage |
| RNF-02 | Pasta de armazenamento fisico deve ser backend/storage |
| RNF-03 | Metadados devem permanecer apenas em memoria nesta fase inicial |
| RNF-04 | Configuracao via variaveis de ambiente (12-Factor App), sem valores sensiveis hardcoded |
| RNF-05 | Arquitetura backend deve seguir fluxo routes -> controllers -> services -> repositories |
| RNF-06 | Funcoes devem ser pequenas, com responsabilidade unica e codigo legivel |
| RNF-07 | Erros devem ser tratados nos limites do sistema (entrada HTTP e I/O de arquivos) |
| RNF-08 | Respostas de erro devem ser consistentes em formato JSON |
| RNF-09 | Projeto deve permanecer em JavaScript puro (sem TypeScript nesta fase) |
| RNF-10 | Implementacao deve evitar overengineering e respeitar KISS, DRY e YAGNI |

## 5. Modelo de dados

### 5.1 Entidade DocumentMetadata

| Campo | Tipo | Obrigatorio | Descricao | Restricoes |
| ----- | ---- | ----------- | --------- | ---------- |
| id | string | Sim | Identificador unico do documento | Nao vazio, unico no processo |
| originalName | string | Sim | Nome original do arquivo enviado | Nao vazio |
| mimeType | string | Sim | MIME type recebido no upload | Formato text/plain, application/pdf etc. |
| extension | string | Nao | Extensao derivada de originalName | Normalizada para lowercase quando existir |
| size | number | Sim | Tamanho do arquivo em bytes | size >= 0 |
| storageFileName | string | Sim | Nome interno do arquivo no disco | Nao vazio, unico |
| storagePath | string | Sim | Caminho fisico do arquivo salvo | Deve apontar para backend/storage |
| uploadedAt | string | Sim | Data/hora do upload | ISO 8601 em UTC |
| owner | string | Sim | Identificador do usuario dono | Nao vazio, trim aplicado |

### 5.2 Estrutura de persistencia em memoria

- Estrutura recomendada: Map<string, DocumentMetadata> indexada por id
- Estrutura auxiliar opcional: array para listagem ordenada
- Ciclo de vida: residente apenas no processo Node.js
- Implicacao: reinicio do backend remove todos os metadados em memoria

### 5.3 Regras e invariantes

- id e storageFileName devem ser gerados para evitar colisao
- originalName deve preservar o nome enviado pelo usuario
- storagePath deve sempre referenciar arquivo local em backend/storage
- owner deve ser string nao vazia apos trim
- uploadedAt deve ser gerado no backend no momento da persistencia

## 6. Contratos de API

Base path: /api (frontend) com proxy para backend.

Padrao de erro JSON:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descricao objetiva do erro"
  }
}
```

### 6.1 GET /health

Finalidade: verificar disponibilidade basica do servico.

Request:

- Sem parametros

Response 200:

```json
{
  "status": "ok"
}
```

### 6.2 POST /upload

Finalidade: receber arquivo e criar metadado.

Request:

- Content-Type: multipart/form-data
- Campos:
- file (binary, obrigatorio)
- owner (string, obrigatorio)

Response 201:

```json
{
  "id": "doc_01JYABCDEF1234567890",
  "originalName": "contrato.pdf",
  "mimeType": "application/pdf",
  "extension": "pdf",
  "size": 245760,
  "storageFileName": "doc_01JYABCDEF1234567890.pdf",
  "storagePath": "backend/storage/doc_01JYABCDEF1234567890.pdf",
  "uploadedAt": "2026-07-08T12:34:56.000Z",
  "owner": "user-123"
}
```

Erros esperados:

- 400 VALIDATION_ERROR: file ausente
- 400 VALIDATION_ERROR: owner ausente ou vazio
- 413 FILE_TOO_LARGE: arquivo acima do limite configurado
- 415 UNSUPPORTED_MEDIA_TYPE: tipo de arquivo bloqueado por regra
- 500 INTERNAL_ERROR: falha inesperada durante persistencia

### 6.3 GET /documents

Finalidade: listar metadados de documentos.

Request:

- Sem parametros obrigatorios nesta fase

Response 200:

```json
[
  {
    "id": "doc_01JYABCDEF1234567890",
    "originalName": "contrato.pdf",
    "mimeType": "application/pdf",
    "extension": "pdf",
    "size": 245760,
    "storageFileName": "doc_01JYABCDEF1234567890.pdf",
    "storagePath": "backend/storage/doc_01JYABCDEF1234567890.pdf",
    "uploadedAt": "2026-07-08T12:34:56.000Z",
    "owner": "user-123"
  }
]
```

Regras:

- Ordenacao padrao por uploadedAt desc
- Colecao vazia retorna []

Erros esperados:

- 500 INTERNAL_ERROR: falha inesperada ao montar listagem

### 6.4 GET /documents/:id/download

Finalidade: baixar arquivo associado ao id informado.

Path params:

- id (string, obrigatorio)

Response 200:

- Conteudo binario do arquivo
- Headers obrigatorios:
- Content-Type: mimeType do documento
- Content-Disposition: attachment; filename="<originalName>"

Erros esperados:

- 400 VALIDATION_ERROR: id ausente/invalido no path
- 404 DOCUMENT_NOT_FOUND: metadado nao localizado
- 404 FILE_NOT_FOUND: arquivo nao localizado no disco
- 500 INTERNAL_ERROR: erro inesperado durante stream

## 7. Decisoes arquiteturais

### 7.1 Backend - Clean Architecture simples

Camadas em backend/src:

- routes/: definicao de endpoints e delegacao para controllers
- controllers/: adaptacao HTTP, validacao basica de entrada e mapeamento de resposta
- services/: regras de negocio de upload, listagem e download
- repositories/: persistencia de metadados em memoria e acesso ao filesystem local

Fluxo de dependencia permitido:

- routes -> controllers -> services -> repositories

Dependencias proibidas:

- repositories nao dependem de services/controllers/routes
- services nao dependem de routes
- controllers nao devem conter regra de negocio complexa

### 7.2 Persistencia local com multer

- Upload deve usar multer com diskStorage
- Destino fixo: backend/storage
- Nome interno de arquivo deve evitar colisao
- Nao usar provedores externos de arquivo

### 7.3 Frontend React (escopo de implementacao futura)

- Componentes funcionais com hooks
- Organizacao em components/, pages/, services/
- Comunicacao com backend via fetch usando prefixo /api

## 8. Plano de execucao em etapas

> Este plano define somente as etapas de implementacao futuras. A execucao de
> codigo backend/frontend nao faz parte deste documento.

### Etapa 1 - Configuracao base de upload

- Configurar middleware multer com diskStorage
- Garantir criacao/uso da pasta backend/storage
- Definir limites de upload por variavel de ambiente

Entrega esperada:

- Estrutura pronta para receber arquivo e owner via multipart/form-data

### Etapa 2 - Repositorio de metadados em memoria

- Criar repositorio com operacoes save, findById, findAll
- Garantir unicidade de id
- Definir politica de ordenacao para listagem

Entrega esperada:

- Persistencia em memoria funcional para metadados

### Etapa 3 - Service de documentos

- Implementar regras de negocio de upload, listagem e download
- Aplicar validacoes de dominio (owner, id, arquivo)
- Padronizar erros de negocio

Entrega esperada:

- Camada de servico isolada e testavel

### Etapa 4 - Controllers e rotas

- Criar controllers para upload/list/download
- Criar rotas /upload, /documents e /documents/:id/download
- Integrar rotas no app principal

Entrega esperada:

- API funcional com contratos definidos nesta especificacao

### Etapa 5 - Configuracao e observabilidade minima

- Ajustar variaveis de ambiente (porta, limites, tipos)
- Implementar tratamento de erros centralizado
- Manter endpoint /health ativo

Entrega esperada:

- Backend configuravel e com retorno de erro consistente

### Etapa 6 - Frontend React

- Criar componentes de upload, listagem e download
- Implementar servicos de API com fetch
- Exibir estados basicos (carregando, sucesso, erro)

Entrega esperada:

- Interface funcional integrada aos endpoints do backend

### Etapa 7 - Testes

- Backend: testes de unidade e integracao com node:test
- Cobrir cenarios de sucesso e falha por endpoint
- Validar smoke test do app e fluxo principal de documentos

Entrega esperada:

- Conjunto minimo de testes para reduzir regressao

### Etapa 8 - Checklist de aceite

- Verificar aderencia aos RFs e RNFs
- Confirmar restricao de armazenamento local com multer
- Revisar documentacao final e exemplos de API

Entrega esperada:

- Release inicial pronto para validacao funcional

## 9. Criterios de aceite globais

- Todos os endpoints previstos respondem com codigos HTTP coerentes
- Upload salva arquivo localmente em backend/storage
- Metadados permanecem em memoria e sao perdidos apos restart
- Download retorna arquivo correto para id valido
- Documento respeita arquitetura por camadas definida

## 10. Riscos e mitigacoes

| Risco | Impacto | Mitigacao |
| ----- | ------- | --------- |
| Perda de metadados apos restart | Medio | Documentar limitacao e evoluir para persistencia duravel em fase futura |
| Colisao de nome de arquivo no disco | Alto | Gerar storageFileName unico no backend |
| Upload de arquivo malicioso | Alto | Restringir MIME types e limite de tamanho |
| Acoplamento entre camadas | Medio | Revisao de arquitetura e testes de unidade por camada |
| Inconsistencia de erro na API | Medio | Padronizar formato de erro e testes de contrato |
