// Middleware centralizado de tratamento de erros.
// Captura erros lançados em qualquer camada e retorna uma resposta padronizada.

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message =
    status < 500 ? err.message : 'Erro interno do servidor';

  if (status >= 500) {
    console.error('[errorHandler]', err);
  }

  return res.status(status).json({ error: message });
}

module.exports = errorHandler;
