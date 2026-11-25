# Ejercicio 05 — Resumen de la Persona B

**Datos, middlewares y página estática** de la Books API.

## 1. Qué se ha hecho

Todo lo que **rodea** a la capa HTTP de la API: la "base de datos" en memoria (`db.js`) con sus cuatro
operaciones inmutables, los tres **middlewares propios** (logger, endpoint desconocido y gestor de errores)
y la **página de bienvenida estática** que se sirve en `/`. Con esto se cumplen los requisitos del enunciado
de "middleware propio que responde 404 JSON a rutas desconocidas", "datos en memoria", "errores siempre en
JSON" y "página HTML estática en `/`".

## 2. Archivos y funciones

| Archivo | Qué hace |
|---|---|
| `db.js` | Mock DB: array `books` con los 3 libros iniciales, `generateId` (interno) y `getBooks`, `getBookById`, `addBook`, `deleteBook` (todas `async`) |
| `middlewares/requestLoggerMiddleware.js` | `requestLogger`: imprime método, ruta y body de cada petición y llama a `next()` |
| `middlewares/unknownEndpointMiddleware.js` | `unknownEndpoint`: `404` + `{ "error": "unknown endpoint" }` |
| `middlewares/errorHandlerMiddleware.js` | `errorHandler`: `400` "malformed JSON" o `500` "internal server error", siempre en JSON |
| `public/index.html` | Página de bienvenida: qué es la API y tabla de los 4 endpoints con sus códigos |
| `public/styles.css` | Estilos de la página (sin librerías) |

## 3. Explicación paso a paso

### `db.js`

- **`books`**: `let` (no `const`) porque el array se **reasigna** en cada cambio. Ids como **string**.
- **`generateId()`**: busca el mayor id (`Math.max(...books.map((b) => Number(b.id)))`, o `0` si no hay libros),
  le suma 1 y lo devuelve como string. No se exporta: el id lo decide el servidor, nunca el cliente.
- **`getBooks()`** → devuelve el array.
- **`getBookById(id)`** → `books.find(...)`: el libro o `undefined` si no existe (el controlador responde 404).
- **`addBook({ title, author })`** → recibe los datos **ya validados** por el controlador, crea un objeto
  nuevo `{ id, title, author }` (solo esos tres campos), hace `books = books.concat(book)` y devuelve el libro.
- **`deleteBook(id)`** → si no existe (`some`) devuelve `false`; si existe, `books = books.filter(...)` y `true`.
  El controlador usa ese booleano para decidir entre `204` y `404`.

### `requestLogger(request, response, next)`

Se ejecuta en **todas** las peticiones. Imprime `request.method`, `request.path` y `request.body`, luego
`---`, y llama a `next()` para pasar al siguiente middleware. No responde nada.

### `unknownEndpoint(request, response)`

Está registrado **después** de las rutas: si una petición llega hasta él, nadie ha respondido, así que la
URL no existe. Responde `404` + `{ "error": "unknown endpoint" }` y **no** llama a `next()` (termina el ciclo).

### `errorHandler(error, request, response, next)`

Solo se ejecuta cuando hay un error. Tres casos:
1. `response.headersSent` → ya se empezó a responder; `return next(error)` para que lo gestione Express.
2. `error.type === 'entity.parse.failed'` (lo lanza `express.json()` con un body roto) → `400` + `{ "error": "malformed JSON" }`.
3. Cualquier otro → `console.error(error)` y `500` + `{ "error": "internal server error" }`.

### `public/`

`express.static('public')` sirve los archivos tal cual están en disco: `GET /` devuelve `index.html` y
`GET /styles.css` la hoja de estilos. Sin JavaScript.

## 4. Conceptos del Módulo 05 aplicados

| Diapositiva | Dónde |
|---|---|
| Using a quick mock DB | `db.js` (funciones `async`, datos en memoria) |
| Adding a new note (`generateId`, `concat`) | `db.js` → `generateId`, `addBook` |
| Deleting resources (`filter`) | `db.js` → `deleteBook` |
| Middlewares / `next()` | los tres middlewares |
| Middleware order matters | `express.json` antes del logger; `unknownEndpoint` y `errorHandler` al final (`index.js`) |
| Implementing our own middlewares | `requestLogger` |
| Unknown endpoint | `unknownEndpoint` |
| Handling Errors in Express (`res.status().json()`, 400/500) | `errorHandler` |
| Application-level middleware: `express.static` | `public/index.html`, `public/styles.css` |
| Static vs dynamic content | `public/` (estático) frente a `/books` (JSON dinámico) |

## 5. Fragmentos clave

**Operaciones inmutables en `db.js`**
```js
async function addBook({ title, author }) {
  const book = { id: generateId(), title, author };
  books = books.concat(book); // array nuevo, nada de push
  return book;
}
```
Se reasigna el array en vez de mutarlo, como en las diapositivas. Y al construir el objeto a mano solo
entran `id`, `title` y `author`, aunque el cliente mande más campos.

**El orden importa (`index.js`, escrito en la Fase 0)**
```js
app.use(express.json());      // 1. rellena request.body
app.use(requestLogger);       // 2. ya puede imprimir el body parseado
app.use(express.static('public'));
app.use('/books', bookRouter);
app.use(unknownEndpoint);     // 5. nadie ha respondido → 404
app.use(errorHandler);        // 6. errores → JSON
```

**Middleware de errores**
```js
export const errorHandler = (error, request, response, next) => {
  if (response.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'malformed JSON' });
  }
  console.error(error);
  return response.status(500).json({ error: 'internal server error' });
};
```
Los **4 parámetros** son lo que hace que Express lo trate como gestor de errores.

## 6. Decisiones tomadas y por qué

- **Ids string**: `request.params.id` siempre llega como string; así `find`/`filter` comparan con `===` sin convertir.
- **`db.js` es `async`** aunque no haya BD: el controlador ya usa `await` y en el Módulo 06 solo cambiará este archivo.
- **`deleteBook` devuelve un booleano**: la diapositiva no distingue (204 siempre), pero el enunciado pide 404
  si no existe; el booleano permite al controlador decidirlo sin acceder al array.
- **`unknownEndpoint` usa `.json()`** en vez del `.send()` de la diapositiva: así es explícitamente JSON.
- **`errorHandler` propio**: sin él, un JSON mal formado devuelve una página **HTML** de error de Express, y el
  enunciado pide errores en JSON. No sale tal cual en las diapositivas; aplica la idea de "Handling Errors in Express".
- **Al cliente no se le enseñan detalles del 500**: el error completo solo sale en la consola del servidor.
- **Página sin JavaScript**: no hace falta y ESLint está configurado solo para Node.

## 7. Demo en vivo

Con `npm run dev` arrancado desde `exercises/05`:

1. Abrir `http://localhost:3000/` en el navegador → página de bienvenida con estilos (`express.static`).
2. `GET /xyz` (o `POST /xyz`) del `books.http` → `404 { "error": "unknown endpoint" }`.
3. "POST con JSON mal formado" del `books.http` → `400 { "error": "malformed JSON" }` en JSON (no HTML).
4. Enseñar la **consola del servidor**: cada petición aparece con `Method`, `Path` y `Body` (el body del POST ya parseado).
5. `POST` válido → id `'4'`; `DELETE /books/2` → `204`; `GET /books` muestra el cambio.
6. Reiniciar el servidor (guardar un archivo, `--watch`) → `GET /books` vuelve a tener los 3 libros (memoria).

Con `curl`:
```bash
curl -i localhost:3000/xyz
curl -i -X POST localhost:3000/books -H 'Content-Type: application/json' -d '{"title":'
```

## 8. Preguntas probables del profesor

**¿Qué es un middleware y para qué sirve `next()`?**
Una función que se ejecuta entre la llegada de la petición y la respuesta. Puede leer o modificar
`request`/`response`, responder (y terminar el ciclo) o llamar a `next()` para pasar al siguiente de la cadena.
Si no responde ni llama a `next()`, la petición se queda colgada.

**¿Por qué importa el orden?**
Express ejecuta los middlewares en el orden en que se registran. `express.json()` va antes del logger
porque es quien rellena `request.body`. `unknownEndpoint` va después de las rutas porque solo debe actuar
si ninguna ha respondido; si estuviera al principio, todo daría 404.

**¿Cómo sabe Express que `errorHandler` es de errores?**
Por tener 4 parámetros `(error, request, response, next)`. Express solo lo llama cuando hay un error
(una excepción o un `next(error)`), y se salta los middlewares normales.

**¿Qué hace `express.static`?**
Sirve archivos de una carpeta (`public`) tal cual están en disco: HTML, CSS, imágenes… Es contenido
**estático**: todos reciben los mismos bytes. La ruta es relativa a donde se ejecuta `node`, por eso hay que
arrancar desde `exercises/05`.

**¿Por qué se pierden los datos al reiniciar?**
Porque viven en una variable en memoria del proceso de Node. Al reiniciar, el módulo `db.js` se vuelve a
cargar con los tres libros iniciales. Para persistir haría falta una base de datos (Módulo 06).

**¿Qué problema tiene `generateId` con `max + 1`?**
Si se borra el libro con el id más alto, el siguiente libro reutiliza ese id. Y con mucha concurrencia o
varios servidores podría haber colisiones. La propia diapositiva dice que "no es recomendable" y que se
sustituirá (la BD generará los ids).

**¿Por qué `concat`/`filter` y no `push`/`splice`?**
Porque crean un array nuevo en vez de modificar el existente (inmutabilidad), que es el patrón de las
diapositivas y el mismo que usábamos con el estado en React.
