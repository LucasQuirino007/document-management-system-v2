---
description: Moderniza o frontend do DMS com Tailwind CSS 3 e UX responsiva sem alterar regras de negocio.
name: modernizar-ui-tailwind
argument-hint: direcao visual (ex. clean corporativo, dashboard moderno)
agent: ui-tailwind-stylist
---

# Modernizar UI com Tailwind CSS 3

Evolua o visual da aplicacao em `frontend/` usando Tailwind CSS 3, considerando a direcao visual `${input:direcaoVisual:direcao visual (ex. clean corporativo, dashboard moderno)}`.

Objetivo:

- Entregar uma interface moderna, com melhor hierarquia, espacos, tipografia e estados visuais.

Requisitos obrigatorios:

1. Configurar Tailwind CSS 3 no frontend (Vite + React).
2. Substituir estilos inline por classes Tailwind nos componentes:
   - `frontend/src/App.jsx`
   - `frontend/src/components/UploadComponent.jsx`
   - `frontend/src/components/DocumentList.jsx`
   - `frontend/src/components/DownloadButton.jsx`
3. Manter os fluxos atuais funcionando:
   - upload de documento
   - listagem de documentos
   - download de documento
4. Garantir responsividade (mobile e desktop).
5. Validar que `npm run build` em `frontend/` continua passando.

Boas praticas esperadas:

- Nao alterar regras de negocio nem contratos de API.
- Melhorar a acessibilidade basica (labels, foco visivel, contraste e botoes com estados claros).
- Manter mensagens em portugues e nomes de simbolos em ingles.
