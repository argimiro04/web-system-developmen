// Middleware propio (diapositiva "Unknown endpoint").
// Va al final de index.js, después de todas las rutas: si la petición ha llegado hasta aquí
// es que ninguna ruta ni express.static ha respondido, así que la URL no existe.
// Usamos .json() (y no .send() como en la diapositiva) para que el error sea siempre JSON.
export const unknownEndpoint = (request, response) => {
  // No llama a next(): termina el ciclo petición-respuesta.
  response.status(404).json({ error: 'unknown endpoint' });
};
