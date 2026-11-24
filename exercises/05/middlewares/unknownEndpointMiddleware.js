// TODO Persona B: responder 404 con { error: 'unknown endpoint' }
export const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'pendiente Persona B' });
};
