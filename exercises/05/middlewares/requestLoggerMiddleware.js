// Middleware propio (diapositiva "Implementing our own middlewares"):
// se ejecuta en TODAS las peticiones y muestra en consola qué ha llegado.
// Va registrado DESPUÉS de express.json() en index.js: si no, request.body aún no estaría parseado.
export const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  // No responde: pasa el control al siguiente middleware de la cadena.
  // Sin next() la petición se quedaría colgada aquí.
  next();
};
