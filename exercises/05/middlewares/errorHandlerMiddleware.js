// Middleware de ERRORES. Express lo reconoce por tener 4 parámetros (error, request, response, next):
// solo se ejecuta cuando algo antes ha fallado (o alguien ha llamado a next(error)).
// Sin él, Express respondería a esos errores con una página HTML, y el enunciado pide errores en JSON.
// Aplica la idea de "Handling Errors in Express": código adecuado + response.status().json().
export const errorHandler = (error, request, response, next) => {
  // Si ya se empezó a enviar la respuesta no podemos mandar otra:
  // se lo dejamos al gestor de errores por defecto de Express.
  if (response.headersSent) {
    return next(error);
  }

  // express.json() lanza este tipo de error cuando el body no es JSON válido
  // (ej.: '{"title":'). Es culpa del cliente → 400.
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'malformed JSON' });
  }

  // Cualquier otro error es inesperado (fallo nuestro) → 500.
  // Lo mostramos en consola para depurar, pero al cliente no le damos detalles internos.
  console.error(error);
  return response.status(500).json({ error: 'internal server error' });
};
