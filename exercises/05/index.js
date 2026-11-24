import express from 'express';
import bookRouter from './routes/bookRoutes.js';
import { requestLogger } from './middlewares/requestLoggerMiddleware.js';
import { unknownEndpoint } from './middlewares/unknownEndpointMiddleware.js';
import { errorHandler } from './middlewares/errorHandlerMiddleware.js';

const app = express();

// Middlewares: se ejecutan en el orden en que se registran
app.use(express.json()); // antes del logger, o request.body sería undefined
app.use(requestLogger);
app.use(express.static('public')); // GET / → public/index.html

// Rutas
app.use('/books', bookRouter);

// Al final: si nadie ha respondido, la URL no existe
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
