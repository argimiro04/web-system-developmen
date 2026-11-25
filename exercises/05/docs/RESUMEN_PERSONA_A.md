# Resumen — Persona A: controlador y pruebas de la API

## 1. Qué se ha hecho

He implementado la **capa HTTP** de la Books API: el controlador que decide qué responde cada endpoint
(`GET /books`, `POST /books`, `GET /books/:id`, `DELETE /books/:id`), con su validación y sus códigos de estado.
Los datos no se tocan aquí: el controlador llama a `db.js` (Persona B). También he preparado
`requests/books.http`, con una petición por cada caso de éxito y de error, para probar la API y hacer la demo.

## 2. Archivos y funciones

| Archivo | Qué hace |
|---|---|
| `controllers/bookController.js` | Los 4 handlers de la API: leen `params`/`body`, llaman a `db.js` y responden con código + JSON |
| `requests/books.http` | 15 peticiones de prueba (REST Client) con el resultado esperado en el título de cada una |
| `docs/RESUMEN_PERSONA_A.md` | Este resumen |

## 3. Explicación paso a paso

**Cómo llega una petición al controlador.** `index.js` monta el router con `app.use('/books', bookRouter)`, y
`routes/bookRoutes.js` asocia cada verbo y ruta a una función del controlador (`bookRouter.get('/:id', getBookById)`…).
Cuando la URL y el método coinciden, Express llama a la función con `(request, response)`.

- **`getBooks`** — no recibe nada. Pide la lista a `db.getBooks()` y la devuelve con `response.json(books)`.
  El código es `200` por defecto, así que no hace falta `status`.
- **`createBook`** — recibe el libro en `request.body` (lo ha parseado antes `express.json()`).
  1. Saca `title` y `author` con `request.body ?? {}`: en Express 5 el body es `undefined` si no llega JSON.
  2. Comprueba que los dos son textos no vacíos (`isNonEmptyString`). Si no, `return` + `400` + `{ error: 'title or author missing' }`.
  3. Llama a `db.addBook({ title, author })` con los valores sin espacios sobrantes. `db.js` genera el `id`.
  4. Responde `201` con el libro creado.
- **`getBookById`** — recibe el id en `request.params.id` (string). Si `db.getBookById` devuelve `undefined`,
  `404` + `{ error: 'book not found' }`; si no, el libro con `200`.
- **`deleteBook`** — recibe el id igual. `db.deleteBook` devuelve `true`/`false`. Si es `false`, `404` JSON;
  si es `true`, `204` con `.end()` (sin cuerpo).

## 4. Conceptos del Módulo 05 aplicados

| Concepto (diapositiva) | Dónde |
|---|---|
| Routers in Express | Las funciones se conectan en `routes/bookRoutes.js` |
| Route parameters | `getBookById` y `deleteBook` (`request.params`) |
| Receiving data from the client / json-parser | `createBook` (`request.body`) |
| Adding a new note (validar y responder 400) | `createBook` |
| Fetching a non-existent resource (404) | `getBookById`, `deleteBook` |
| REST / CRUD / códigos de estado | los 4 handlers: 200, 201, 204, 400, 404 |
| Handling Requests (`res.json`, `res.status`) | todos los handlers |
| The Request-Response Cycle (`return` tras responder) | ramas de error de `createBook`, `getBookById`, `deleteBook` |
| Controllers / Naming Conventions | `controllers/bookController.js` (`getBooks`, `createBook`…) |
| Using a quick mock DB (`async`/`await`) | todas las llamadas a `db.*` |
| Testing the backend / REST Client | `requests/books.http` |

## 5. Fragmentos clave

**Validación y creación** (`createBook`):

```js
const { title, author } = request.body ?? {};

if (!isNonEmptyString(title) || !isNonEmptyString(author)) {
  return response.status(400).json({ error: 'title or author missing' });
}

const book = await db.addBook({ title: title.trim(), author: author.trim() });
response.status(201).json(book);
```

El `return` es lo importante: `response.json` termina el ciclo petición-respuesta pero **no** la función.
Sin él, el código seguiría, crearía el libro e intentaría responder otra vez (`Cannot set headers after they are sent`).

**Borrado con 404** (`deleteBook`):

```js
const deleted = await db.deleteBook(id);
if (!deleted) {
  return response.status(404).json({ error: 'book not found' });
}
response.status(204).end();
```

`204 No Content` significa "hecho, y no hay nada que devolver", por eso se usa `.end()` y no `.json()`.

## 6. Decisiones tomadas y por qué

- **`request.body ?? {}`**: en Express 5 el body es `undefined` cuando la petición no trae `Content-Type: application/json`.
  Sin esto, el destructuring lanzaría un `TypeError` y el cliente recibiría un 500 en vez de un 400.
- **Validar que sean strings no vacíos** (no solo que existan): `"   "` o `5` no son títulos válidos.
- **Pasar solo `title` y `author` a `db.addBook`**: así se descartan los campos extra y el `id` que mande el cliente.
  El id lo genera siempre el servidor, como pide el enunciado.
- **Ids string**: `request.params.id` siempre es string; con ids string se compara sin `Number(...)`.
- **DELETE inexistente → 404**: la diapositiva devuelve 204 siempre, pero el enunciado pide 404.
- **`async`/`await` aunque los datos estén en memoria**: es el patrón de la diapositiva "Using a quick mock DB".
  En el Módulo 06, cuando `db.js` haga consultas reales, el controlador no tendrá que cambiar.
- **El controlador no tiene array propio**: los datos solo se tocan a través de `db.js` (separación de capas).

## 7. Demo en vivo

1. `npm run dev` en `exercises/05` (debe salir `Server running on port 3000`).
2. Abrir `requests/books.http` en VS Code y lanzar, en orden:
   - **1** → `200` y los 3 libros.
   - **4** → `201` y `{ "id": "4", "title": "Dune", ... }`. Lanzar **1** otra vez: ya hay 4 libros.
   - **5** y **7** → `400` `title or author missing`.
   - **8** → `201`, y la respuesta no trae `price` ni el id `999`.
   - **9** → `400`, no `500` (enseñar por qué existe el `?? {}`).
   - **2** → `200`; **3** → `404` `book not found`.
   - **11** → `204` sin cuerpo; **12** → `404`.
3. Reiniciar el servidor y lanzar **1**: vuelven los 3 libros (los datos están en memoria).

## 8. Preguntas probables del profesor

- **¿Qué diferencia hay entre `res.send` y `res.json`?** `res.send` adivina el `Content-Type` según lo que le pases;
  `res.json` siempre envía JSON y convierte a JSON cualquier valor. Como la API responde JSON, `res.json` es lo explícito.
- **¿Por qué `201` y `204` y no `200` siempre?** El código le dice al cliente qué ha pasado sin leer el cuerpo:
  `201` es "recurso creado"; `204` es "éxito sin contenido", lo normal tras borrar.
- **¿Por qué hay que hacer `return` después de responder?** Responder termina el ciclo HTTP, no la función. Sin `return`
  el código sigue y puede intentar enviar una segunda respuesta, lo que provoca un error.
- **¿Qué hace `express.json()` y por qué hace falta `Content-Type`?** Es un middleware que convierte el cuerpo JSON
  en un objeto y lo pone en `request.body`. Solo actúa si la cabecera es `application/json`; si no, `body` queda `undefined`.
- **¿Qué es un controlador y en qué se diferencia de un middleware?** El controlador es la "C" de MVC: decide qué
  hacer con la petición y delega los datos en el modelo (`db.js`). En Express se implementa *como* middleware
  (una función `(req, res)`), pero el middleware es un mecanismo de Express y el controlador es un papel en la arquitectura.
- **¿Qué es REST y qué es un recurso aquí?** El recurso son los libros, identificados por URL (`/books`, `/books/:id`),
  y las operaciones se expresan con los verbos HTTP (GET leer, POST crear, DELETE borrar).
- **¿Por qué el id de `request.params` es un string?** Porque todo lo que viene en la URL es texto; por eso los ids
  del contrato también son strings.
