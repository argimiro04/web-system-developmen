# Ejercicio 05 — Books REST API (Express)

Especificación del ejercicio 05 para Claude Code. La usan las dos personas del equipo:
cada una abre Claude Code en la **raíz del repo** y dice una de estas tres cosas:

- **"haz el esqueleto"** → Fase 0 (sección 6). Solo se hace **una vez**, antes que nada.
- **"soy la persona A"** → trabajo de la Persona A (sección 7).
- **"soy la persona B"** → trabajo de la Persona B (sección 8).

> **Regla 0 para Claude**: si el usuario no ha dicho cuál de las tres es, **pregúntaselo antes de tocar nada**.
> Nunca hagas el trabajo de la otra persona "para adelantar", aunque parezca que falta.
> Si para avanzar necesitas algo de la otra persona, **para y avisa al usuario**.

Hay que **exponer el ejercicio en clase**: la documentación (sección 12) es parte de la entrega,
no un extra. Una tarea no está terminada hasta que su documentación está escrita.

---

## 1. Enunciado reorganizado (Módulo 05, "Backend")

API REST con **Express** para gestionar una lista de libros. Cada libro tiene la forma `{ id, title, author }`
y el `id` lo **genera el servidor**. Sin base de datos: los datos viven en memoria. Va en `/exercises/05/` del repo.
Debe demostrar:

- Proyecto Node con npm, `package.json`, ES modules y modo `--watch`.
- Routing con Express y `Router`, parámetros de ruta (`:id`).
- REST: recursos, verbos HTTP y **códigos de estado correctos**.
- Middlewares: `express.json()`, `express.static()` y **middlewares propios**.
- Separación en capas: rutas → controladores → "mock DB" (`db.js`), como en la diapositiva "Project Files".

### Endpoints

| Endpoint | Éxito | Errores |
|---|---|---|
| `GET /books` | `200` + array de libros | — |
| `POST /books` | `201` + el libro creado | `400` si falta `title` o `author` |
| `GET /books/:id` | `200` + el libro | `404` si no existe |
| `DELETE /books/:id` | `204` (cuerpo vacío) | `404` si no existe |

### Requisitos generales

| Requisito | Cómo se cumple |
|---|---|
| Escucha en el puerto **3000** y arranca con `npm run dev` | `const PORT = process.env.PORT \|\| 3000` + script `dev: node --watch index.js` |
| Parsea cuerpos JSON con `express.json()` | primer middleware en `index.js` |
| Middleware **propio** que responde a rutas desconocidas con `404` y `{ "error": "unknown endpoint" }` | `middlewares/unknownEndpointMiddleware.js`, registrado **después** de las rutas |
| Datos en memoria (sin base de datos) | `db.js` |
| Errores **siempre** en JSON: `{ "error": "..." }` | controladores + `unknownEndpoint` + `errorHandler` |
| Página HTML estática de bienvenida en `/` | `public/index.html` servido con `express.static('public')` |

---

## 2. Estructura de carpetas y responsables

```
exercises/05/
├── CLAUDE.md                                   → este archivo (no se toca sin avisar)
├── README.md                                   → Fase 0 (base) / Fase 3 (final)
├── .nvmrc, .gitignore                          → Fase 0
├── package.json, package-lock.json, eslint.config.js → Fase 0 (después NADIE los toca)
├── index.js                                    → Fase 0 (y luego nadie)
├── routes/bookRoutes.js                        → Fase 0 (y luego nadie)
├── controllers/bookController.js               → A (Fase 0 deja un stub)
├── requests/books.http                         → A
├── db.js                                       → B (Fase 0 deja un stub)
├── middlewares/requestLoggerMiddleware.js      → B (Fase 0 deja un stub)
├── middlewares/unknownEndpointMiddleware.js    → B (Fase 0 deja un stub)
├── middlewares/errorHandlerMiddleware.js       → B (Fase 0 deja un stub)
├── public/index.html                           → B (Fase 0 deja un placeholder)
├── public/styles.css                           → B
└── docs/
    ├── RESUMEN_PERSONA_A.md                    → A
    ├── RESUMEN_PERSONA_B.md                    → B
    └── RESUMEN_GENERAL.md                      → Fase 3
```

Reparto en una frase: **A es la capa HTTP de la API** (controlador: qué responde cada endpoint, validación y
códigos de estado, más las peticiones de prueba). **B es todo lo que la rodea** (los datos en memoria, los
middlewares propios y la página estática).

Tras la Fase 0, **A y B no comparten ningún archivo**. Así las dos ramas se mergean sin conflictos y en cualquier orden.

---

## 3. Contrato común (congelado)

**No se cambia sin avisar al compañero.** Si Claude cree que hay que cambiar algo de aquí, **para y se lo dice al usuario**.

### 3.1 Forma de un libro y datos iniciales

```js
// id es un STRING (los params de la URL llegan como string, así se comparan sin convertir).
{ id: '1', title: 'Clean Code', author: 'Robert C. Martin' }
```

Datos iniciales de `db.js` (las peticiones de prueba de A cuentan con ellos):

```js
let books = [
  { id: '1', title: 'Clean Code',               author: 'Robert C. Martin' },
  { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas' },
  { id: '3', title: 'Eloquent JavaScript',      author: 'Marijn Haverbeke' },
];
```

- Las respuestas devuelven **solo** `id`, `title` y `author` (nunca campos extra que mande el cliente).
- Al reiniciar el servidor los datos vuelven a estos tres libros (es memoria, es lo esperado).

### 3.2 Mock DB — `db.js` (patrón de la diapositiva "Using a quick mock DB")

```js
// Funciones async aunque no haya BD: así el controlador ya usa await y en el Módulo 06
// solo habrá que cambiar este archivo por consultas reales.
async function getBooks()                // → Promise<Book[]>
async function getBookById(id)           // → Promise<Book | undefined>
async function addBook({ title, author }) // genera el id → Promise<Book> (el libro creado)
async function deleteBook(id)            // → Promise<boolean>: true si existía y se borró, false si no

export default { getBooks, getBookById, addBook, deleteBook };
```

- El controlador lo importa como `import db from '../db.js'` y llama a `db.getBooks()`, etc.
- `addBook` recibe `title` y `author` **ya validados** (la validación es del controlador).
- `generateId` es interno de `db.js` (no se exporta).

### 3.3 Controlador — `controllers/bookController.js`

```js
export async function getBooks(request, response)
export async function createBook(request, response)
export async function getBookById(request, response)
export async function deleteBook(request, response)
```

Nombres según la diapositiva "Naming Conventions". `routes/bookRoutes.js` (Fase 0) ya los conecta:

```js
bookRouter.get('/', getBooks);
bookRouter.post('/', createBook);
bookRouter.get('/:id', getBookById);
bookRouter.delete('/:id', deleteBook);
```

### 3.4 Middlewares — `middlewares/*.js`

```js
export const requestLogger   = (request, response, next) => { ... }        // requestLoggerMiddleware.js
export const unknownEndpoint = (request, response) => { ... }              // unknownEndpointMiddleware.js
export const errorHandler    = (error, request, response, next) => { ... } // errorHandlerMiddleware.js
```

### 3.5 Orden en `index.js` (lo escribe la Fase 0, nadie lo cambia)

```js
app.use(express.json());            // 1. parsea el body (antes del logger, o request.body sería undefined)
app.use(requestLogger);             // 2. log de cada petición
app.use(express.static('public'));  // 3. GET / → public/index.html, /styles.css
app.use('/books', bookRouter);      // 4. la API
app.use(unknownEndpoint);           // 5. nada ha respondido → 404 JSON
app.use(errorHandler);              // 6. errores (JSON mal formado, excepciones) → JSON
```

### 3.6 Mensajes de error (exactos)

| Situación | Código | Cuerpo | Quién |
|---|---|---|---|
| POST sin `title` o sin `author` (o vacíos / solo espacios / no string) | `400` | `{ "error": "title or author missing" }` | A |
| GET o DELETE de un id que no existe | `404` | `{ "error": "book not found" }` | A |
| Ruta desconocida (cualquier método) | `404` | `{ "error": "unknown endpoint" }` | B |
| Body con JSON mal formado | `400` | `{ "error": "malformed JSON" }` | B |
| Cualquier otro error inesperado | `500` | `{ "error": "internal server error" }` | B |

---

## 4. Norma de Git (OBLIGATORIA, por encima de cualquier otra instrucción)

1. **NUNCA** trabajar, hacer commit ni push en `main`. Antes de tocar nada: `git branch --show-current`.
   Si es `main`: `git pull` y `git checkout -b <rama>`. Si hay cambios sin commitear de otro ejercicio, **avisar** antes de crear la rama.
2. Ramas:
   - `ex05-esqueleto` → Fase 0
   - `ex05-persona-a` → Persona A
   - `ex05-persona-b` → Persona B
   - `ex05-resumen-general` → Fase 3
3. Commits pequeños con mensajes claros (`feat(ex05): ...`, `docs(ex05): ...`, `fix(ex05): ...`).
4. Al terminar: `git push -u origin <rama>` y abrir un **Pull Request contra `main`** (`gh pr create --base main` si existe `gh`;
   si no, dar al usuario el enlace). Título claro y descripción con qué se ha hecho y cómo probarlo.
5. **NUNCA** hacer merge del PR, `git merge` en `main` ni `git push --force`. **El merge lo hace el responsable del repo.**
6. **No añadir dependencias** después de la Fase 0 (nada de `npm install <paquete>`). Si hiciera falta, parar y avisar.
7. **Nunca** commitear `node_modules/` ni un `.env`.

---

## 5. Plan y orden

| Fase | Quién | Qué | Tiempo aprox. |
|---|---|---|---|
| 0 | Una sola persona (recomendado: el responsable del repo) | Esqueleto que arranca, con `index.js`, rutas y stubs. PR → merge | 30 min |
| 1 | A y B **en paralelo**, cada uno desde `main` actualizado | Su parte + su resumen. PR cada uno → merge | 1,5-2 h |
| 2 | Los dos juntos | Checklist de integración (sección 11.3) sobre `main` | 20 min |
| 3 | Quien termine el último | `RESUMEN_GENERAL.md` + `README.md` final + guion de exposición | 45 min |
| — | Los dos | Ensayar la exposición con la demo | 30 min |

**Por qué hay Fase 0**: `index.js` importa a la vez el controlador de A y los middlewares de B; `bookController`
necesita el `db.js` de B. Sin esqueleto, ninguno de los dos podría arrancar el servidor sin la parte del otro.
Con los stubs, todo existe desde el principio (aunque vacío) y nadie espera a nadie.

---

## 6. Fase 0 — Esqueleto (rama `ex05-esqueleto`)

1. Crear el proyecto sin comandos interactivos (no usar `npx eslint --init`, que hace preguntas):
   ```bash
   cd exercises/05            # si no existe, crearla; este CLAUDE.md ya puede estar dentro
   npm init -y
   npm pkg set type=module main=index.js
   npm pkg set scripts.start="node index.js" scripts.dev="node --watch index.js" scripts.lint="eslint ."
   npm install express
   npm install --save-dev eslint @eslint/js globals
   ```
   Comprobar que `express` es la versión **5** (`^5.x`). Si algún comando pide confirmación, **parar y pedir al usuario que lo ejecute él**.
2. `.nvmrc` con `v24.11.0` y `.gitignore` con `node_modules/` y `.env`.
3. `eslint.config.js` (diapositiva "Formatting the Configuration File"):
   ```js
   import js from '@eslint/js';
   import { defineConfig } from 'eslint/config';
   import globals from 'globals';

   export default defineConfig([
     { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
     { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
   ]);
   ```
4. `index.js` **completo** con el orden de la sección 3.5 y:
   ```js
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```
   No usar `--env-file` (falla si no existe `.env`) ni `dotenv`.
5. `routes/bookRoutes.js` **completo** según la sección 3.3 (`Router` + `export default bookRouter`).
6. Stubs (A y B los completan sin cambiar los nombres ni las firmas):
   ```js
   // controllers/bookController.js — TODO Persona A
   export async function getBooks(request, response) {
     response.status(501).json({ error: 'pendiente Persona A' });
   }
   // ...igual para createBook, getBookById y deleteBook
   ```
   ```js
   // db.js — TODO Persona B: datos iniciales (sección 3.1) y operaciones inmutables
   let books = [];
   async function getBooks() { return books; }
   async function getBookById(id) { return undefined; }
   async function addBook({ title, author }) { return { id: '0', title, author }; }
   async function deleteBook(id) { return false; }
   export default { getBooks, getBookById, addBook, deleteBook };
   ```
   ```js
   // middlewares/requestLoggerMiddleware.js — TODO Persona B
   export const requestLogger = (request, response, next) => { next(); };
   // middlewares/unknownEndpointMiddleware.js — TODO Persona B
   export const unknownEndpoint = (request, response) => { response.status(404).json({ error: 'pendiente Persona B' }); };
   // middlewares/errorHandlerMiddleware.js — TODO Persona B (Express lo reconoce por tener 4 parámetros)
   export const errorHandler = (error, request, response, next) => { next(error); };
   ```
   `npm run lint` puede marcar parámetros sin usar en los stubs de `db.js`: es esperado y desaparece cuando B lo completa.
7. `public/index.html` placeholder (`<h1>Books API — pendiente Persona B</h1>`).
8. `README.md` base: qué es, cómo arrancar (`nvm use`, `npm install`, `npm run dev`), endpoints, estructura y reparto.
9. Verificar: `npm run dev` arranca en el 3000; `GET /` devuelve el placeholder; `GET /books` devuelve `501` JSON;
   `GET /xyz` devuelve `404`. Parar el servidor después.
10. Commit, push y PR. **Avisar a los dos de que no empiecen la Fase 1 hasta que esté mergeado.**

---

## 7. Persona A — Controlador y pruebas de la API (rama `ex05-persona-a`)

Archivos: `controllers/bookController.js`, `requests/books.http`, `docs/RESUMEN_PERSONA_A.md`.

- **`getBooks`**: `response.json(await db.getBooks())` → `200`.
- **`createBook`**:
  - `const { title, author } = request.body ?? {};` → en **Express 5**, `request.body` es `undefined`
    si la petición no trae JSON (sin `Content-Type: application/json`). Sin el `?? {}` el destructuring lanza un error y saldría un 500.
  - Válido solo si los dos son `string` y no están vacíos tras `trim()`. Si no →
    `return response.status(400).json({ error: 'title or author missing' })`.
  - `const book = await db.addBook({ title: title.trim(), author: author.trim() });` → `response.status(201).json(book)`.
  - Se ignoran los campos extra y un `id` enviado por el cliente (el id lo genera el servidor).
- **`getBookById`**: `const { id } = request.params;` (es string, igual que los ids del contrato).
  Si `db.getBookById(id)` devuelve `undefined` → `404` + `{ error: 'book not found' }`. Si existe → `response.json(book)`.
- **`deleteBook`**: `const deleted = await db.deleteBook(id);` → si `false`, `404` + `{ error: 'book not found' }`;
  si `true`, `response.status(204).end()` (**sin cuerpo**: `.end()`, no `.json()`).
  Ojo: en la diapositiva "Deleting resources" se devuelve 204 siempre; **el enunciado pide 404 si no existe**.
- **Siempre `return`** al responder dentro de un `if` (diapositiva "The Request-Response Cycle"): `res.json` no
  termina la función y un segundo envío provoca `Cannot set headers after they are sent`.
- Usar `response.json(...)` para JSON (diapositiva "res.send vs res.json") y `response.status(...)` encadenado delante.
- **`requests/books.http`** (extensión REST Client, diapositiva "REST Client"), con `@baseUrl = http://localhost:3000`
  y una petición por cada caso, separadas por `###` y con título:
  - GET todos · GET `/books/1` · GET `/books/999` (404)
  - POST válido · POST sin `title` · POST sin `author` · POST con `"title": "   "` · POST con un campo extra y un `id` (se ignoran)
  - POST sin cabecera `Content-Type` (debe dar 400, no 500) · POST con JSON mal formado (lo resuelve B: 400 JSON)
  - DELETE `/books/2` (204) · DELETE `/books/2` otra vez (404)
  - GET `/` (página de bienvenida) · GET `/xyz` y POST `/xyz` (404 unknown endpoint)
- **Probar en aislamiento** mientras B no ha terminado: el stub de `db.js` no guarda nada. Se puede poner temporalmente
  la lista de la sección 3.1 en el stub para ver respuestas reales, **sin commitearlo**. La prueba real es en la Fase 2.

---

## 8. Persona B — Datos, middlewares y página estática (rama `ex05-persona-b`)

Archivos: `db.js`, `middlewares/requestLoggerMiddleware.js`, `middlewares/unknownEndpointMiddleware.js`,
`middlewares/errorHandlerMiddleware.js`, `public/index.html`, `public/styles.css`, `docs/RESUMEN_PERSONA_B.md`.

- **`db.js`** (completar el stub, sin cambiar la interfaz de la sección 3.2):
  - `let books = [...]` con los tres libros de la sección 3.1.
  - `generateId()` interno, como en la diapositiva "Adding a new note":
    `Math.max(...books.map((b) => Number(b.id)))` (o `0` si está vacío) `+ 1`, devuelto como **string**.
  - `getBookById(id)`: `find`.
  - `addBook({ title, author })`: crea `{ id: generateId(), title, author }` y hace `books = books.concat(book)`; devuelve el libro.
  - `deleteBook(id)`: si no existe (`some`/`find`) devuelve `false`; si existe, `books = books.filter(...)` y devuelve `true`.
  - **Prohibido** `push`, `splice` o modificar objetos del array: se **reasigna** con `concat`/`filter`, igual que en las diapositivas.
- **`requestLogger`** (diapositiva "Implementing our own middlewares"): imprime `Method`, `Path`, `Body` y `---`, y llama a `next()`.
- **`unknownEndpoint`** (diapositiva "Unknown endpoint"): `response.status(404).json({ error: 'unknown endpoint' })`.
  No llama a `next()`: termina el ciclo. Funciona porque en `index.js` está **después** de todas las rutas.
- **`errorHandler`** (middleware de error: Express lo distingue por tener **4 parámetros**; no sale tal cual en las
  diapositivas, así que va comentado y explicado en el resumen):
  - Si `response.headersSent` → `return next(error)` (deja que Express lo gestione).
  - Si `error.type === 'entity.parse.failed'` (lo lanza `express.json()` con JSON mal formado) → `400` + `{ error: 'malformed JSON' }`.
  - Cualquier otro → `console.error(error)` y `500` + `{ error: 'internal server error' }`
    (diapositiva "Handling Errors in Express": códigos adecuados con `res.status().json()`).
  - Sin él, Express respondería a esos errores con una página **HTML**, y el enunciado pide errores en JSON.
- **`public/index.html`**: página de bienvenida sencilla: título, qué es la API, tabla de los 4 endpoints
  con sus códigos y `<link rel="stylesheet" href="/styles.css" />`. **Sin JavaScript** (no hace falta y ESLint no está configurado para el navegador).
- **`public/styles.css`**: estilos simples para la página (tipografía, tabla, colores suaves). Sin librerías.
- **Probar en aislamiento**: el controlador todavía es un stub (`501`). Para probar `db.js` sin servidor:
  ```bash
  node -e "import('./db.js').then(async ({ default: db }) => {
    console.log(await db.addBook({ title: 'T', author: 'A' }));   // id '4'
    console.log(await db.deleteBook('2'), await db.deleteBook('2')); // true false
    console.log(await db.getBooks());
  })"
  ```
  Los middlewares se prueban arrancando el servidor: `GET /xyz`, `GET /`, `/styles.css` y un POST con JSON roto (ver 11.2).

---

## 9. Reglas de código (para todo el ejercicio)

1. **Usar lo que está en el temario del Módulo 05**: ES modules (`import`/`export`, con la extensión `.js` en las rutas
   relativas), Express 5, `Router`, `request.params`, `request.body`, `response.json`, `response.status().end()`,
   middlewares (`app.use`, `next`), `express.json()`, `express.static()`, controladores y mock DB con funciones `async`.
2. **No usar** (no salen en clase o no aportan aquí): base de datos, `dotenv`, `nodemon`, `cors`, `morgan`,
   `body-parser` suelto, `uuid`, TypeScript, plantillas (`ejs`), ni JavaScript en `public/`.
   Las únicas dependencias son `express` y, de desarrollo, `eslint`, `@eslint/js` y `globals`.
   Si de verdad hiciera falta algo de fuera del temario, comentar qué hace y por qué, y mencionarlo en el resumen.
3. Los datos **solo** se tocan a través de `db.js`. El controlador nunca tiene su propio array.
4. Todo error sale como JSON `{ error: '...' }` con los mensajes exactos de la sección 3.6. Nada de `res.send('texto')` para errores.
5. Tras enviar una respuesta en una rama, `return`. Nunca dos respuestas en la misma petición.
6. `npm run lint` **sin errores** antes de abrir el PR.
7. **Comentarios en español** explicando el **porqué** y el concepto del temario que se aplica
   (ej.: `// Va al final: si ninguna ruta ha respondido, la URL no existe`). Pensados para leerse en voz alta
   en la exposición. Sin comentar lo obvio.
8. **Para Claude**: el servidor con `--watch` no termina nunca. Arrancarlo en segundo plano, probar con `curl`
   y **pararlo** al acabar. Si el 3000 está ocupado, `PORT=3001 npm run dev` (sin cambiar el código).

---

## 10. Flujo de Claude cuando el usuario diga "soy la persona A/B"

1. **Comprobar** que la Fase 0 está mergeada en `main` (existen `index.js`, `routes/bookRoutes.js` y los stubs).
   Si no, parar y decirlo.
2. **Resumir** al usuario en pocas líneas su parte (archivos, qué hay que hacer, códigos y mensajes de error) y **pedir confirmación**.
3. **Git**: `git checkout main && git pull`, crear su rama (sección 4). Ejecutar `npm install` en `exercises/05`.
4. **Alcance**: tocar **solo** sus archivos (sección 2). Si necesita algo del otro, respetar el contrato; si hay que cambiarlo, parar y avisar.
5. **Implementar** con las reglas de la sección 9, un commit por pieza
   (A: GET → POST → GET por id → DELETE → `books.http`; B: `db.js` → middlewares → página estática).
6. **Verificar**: `npm run lint` sin errores, `npm run dev` y su checklist (sección 11). Quitar cualquier código de prueba temporal.
7. **Documentar**: escribir `docs/RESUMEN_PERSONA_X.md` (sección 12.1) en la misma rama.
8. **Entregar**: push y PR contra `main` con descripción y cómo probarlo. **No mergear**: avisar de que está listo.

---

## 11. Checklists

Comandos de referencia (con el servidor arrancado; `-i` muestra el código de estado):

```bash
curl -i localhost:3000/books
curl -i -X POST localhost:3000/books -H 'Content-Type: application/json' -d '{"title":"Dune","author":"Frank Herbert"}'
curl -i localhost:3000/books/1
curl -i -X DELETE localhost:3000/books/2
```

### 11.1 Persona A

- [ ] `GET /books` → `200` y un array.
- [ ] `POST` válido → `201` con `{ id, title, author }` e `id` generado por el servidor (string).
- [ ] `POST` con un `id` y un campo extra → se ignoran (la respuesta solo tiene `id`, `title`, `author`).
- [ ] `POST` sin `title`, sin `author`, o con `"   "` → `400` + `{ "error": "title or author missing" }`.
- [ ] `POST` sin cabecera `Content-Type` → `400`, **no** `500`.
- [ ] `GET /books/999` → `404` + `{ "error": "book not found" }`.
- [ ] `DELETE` de un id existente → `204` sin cuerpo; repetirlo → `404` JSON.
- [ ] Ningún handler envía dos respuestas (no aparece `Cannot set headers after they are sent` en la consola).
- [ ] `requests/books.http` tiene todos los casos de la sección 7 con título.
- [ ] `npm run lint` sin errores.

### 11.2 Persona B

- [ ] `db.js` arranca con los 3 libros del contrato; `addBook` da ids `'4'`, `'5'`… como string.
- [ ] `deleteBook` devuelve `true` la primera vez y `false` la segunda.
- [ ] No hay `push`, `splice` ni mutaciones en `db.js` (buscar en el código).
- [ ] `GET /` → página de bienvenida con estilos (`/styles.css` responde `200`).
- [ ] `GET /xyz`, `POST /xyz` y `GET /books/1/algo` → `404` + `{ "error": "unknown endpoint" }`.
- [ ] `POST /books` con `-d '{"title":'` y `Content-Type: application/json` → `400` + `{ "error": "malformed JSON" }` (JSON, no HTML).
- [ ] El logger imprime método, ruta y body de cada petición, y el body ya viene parseado.
- [ ] `npm run lint` sin errores.

### 11.3 Integración (los dos juntos, sobre `main` con todo mergeado)

- [ ] Ejecutar `requests/books.http` de arriba abajo: cada respuesta tiene el código y el cuerpo esperados.
- [ ] Secuencia completa: crear → aparece en `GET /books` → `GET /books/:id` → borrar → `GET` del mismo id da `404`.
- [ ] Reiniciar el servidor → vuelven los 3 libros iniciales (memoria).
- [ ] Todos los errores de la sección 3.6 salen en JSON con el mensaje exacto.
- [ ] `npm run dev` arranca en el puerto 3000 sin avisos; `npm run lint` sin errores.
- [ ] La consola del servidor no muestra trazas de error durante la checklist (salvo el `console.error` del caso 500, si se prueba).

---

## 12. Documentación para la exposición (OBLIGATORIA)

### 12.1 Resumen individual — `docs/RESUMEN_PERSONA_A.md` / `docs/RESUMEN_PERSONA_B.md`

Cada persona en su rama, dentro de su PR. Secciones:

1. **Qué se ha hecho** (3-5 líneas).
2. **Archivos y funciones** de los que es responsable (tabla: archivo → qué hace).
3. **Explicación paso a paso** de cada función, pensada para contarla en voz alta: qué recibe (`params`, `body`),
   a qué llama, qué responde y con qué código.
4. **Conceptos del Módulo 05 aplicados** y dónde (archivo y función), usando el mapa de la sección 13.
5. **Fragmentos clave** de código (los 2-3 más importantes) con su explicación.
6. **Decisiones tomadas y por qué** (ej.: por qué ids string; por qué `request.body ?? {}`; por qué DELETE da 404
   aunque la diapositiva use 204; por qué el `errorHandler` tiene 4 parámetros; por qué `db.js` es `async`).
7. **Demo en vivo**: pasos exactos para enseñar su parte (qué petición del `.http` lanzar y qué debe verse).
8. **5-6 preguntas probables del profesor con su respuesta**. Ejemplos:
   - A: ¿Qué diferencia hay entre `res.send` y `res.json`? ¿Por qué `201` y `204` y no `200`? ¿Por qué hay que hacer
     `return` después de responder? ¿Qué hace `express.json()` y por qué hace falta la cabecera `Content-Type`?
     ¿Qué es un controlador y en qué se diferencia de un middleware? ¿Qué es REST y qué es un recurso?
   - B: ¿Qué es un middleware y para qué sirve `next()`? ¿Por qué importa el orden (`express.json` antes del logger,
     `unknownEndpoint` al final)? ¿Cómo sabe Express que `errorHandler` es de errores? ¿Qué hace `express.static`?
     ¿Por qué se pierden los datos al reiniciar? ¿Qué problema tiene `generateId` con `max + 1` (reutiliza ids tras borrar el último)?

### 12.2 Resumen general — `docs/RESUMEN_GENERAL.md` (Fase 3, rama `ex05-resumen-general`)

Quien termine el último, con las dos partes ya en `main`:

1. **Visión global** del proyecto (qué es y qué demuestra del temario).
2. **Diagrama** del recorrido de una petición por los middlewares y las capas, en Mermaid (GitHub lo pinta), por ejemplo:
   ```mermaid
   flowchart LR
     C[Cliente] --> J[express.json]
     J --> L[requestLogger]
     L --> S[express.static<br/>public/]
     S -- "GET / , /styles.css" --> H[index.html]
     S --> R["/books → bookRouter"]
     R --> K[bookController]
     K --> D[(db.js<br/>memoria)]
     R -- ninguna ruta coincide --> U[unknownEndpoint<br/>404 JSON]
     J -. JSON mal formado .-> E[errorHandler<br/>400 / 500 JSON]
   ```
3. **Recorrido de una petición**: `POST /books` → `express.json` rellena `request.body` → logger → router →
   `createBook` valida → `db.addBook` genera id → `201` + libro.
4. **Cómo encajan las dos partes** a través del contrato (sección 3).
5. **Mapa temario → código** (sección 13, actualizada con los archivos reales).
6. **Guion de exposición** (8-10 min), repartido entre A y B:
   - Introducción, estructura del proyecto y `package.json` (`type: module`, `--watch`) (1 min, A).
   - REST: endpoints, verbos y códigos de estado (2 min, A).
   - Controlador: `params`, `body`, validación, `return` tras responder (2 min, A).
   - Middlewares: qué son, `next()`, orden en `index.js`, `unknownEndpoint` y `errorHandler` (2 min, B).
   - Mock DB: datos en memoria, `generateId`, por qué `async` (1 min, B).
   - Demo en vivo con `books.http` siguiendo la checklist 11.3 (2 min, los dos).
7. **Preguntas probables** juntando las de los dos resúmenes.

### 12.3 `README.md` final (Fase 3, misma rama)

Descripción, requisitos (`nvm use`), cómo arrancar (`npm install`, `npm run dev`) y lanzar el linter, tabla de endpoints
con códigos, cómo probar con `requests/books.http`, estructura de carpetas, reparto A/B y enlaces a los tres resúmenes de `docs/`.

### 12.4 Pull Requests

Cada PR describe: qué incluye, archivos tocados, cómo probarlo (pasos o peticiones del `.http`) y enlace al resumen correspondiente.

---

## 13. Mapa temario (Módulo 05) → código

| Diapositiva | Dónde se usa | Quién |
|---|---|---|
| NPM / `package.json` / Modules (ES6) | `package.json` (`type: module`), `import`/`export` en todo | Fase 0 |
| Automatic Change Tracking (`--watch`) | script `dev` | Fase 0 |
| The port variable | `index.js` (`process.env.PORT \|\| 3000`) | Fase 0 |
| Linting / ESLint | `eslint.config.js`, script `lint` | Fase 0 |
| Routers in Express | `routes/bookRoutes.js`, `app.use('/books', ...)` | Fase 0 |
| Route parameters | `getBookById`, `deleteBook` (`request.params.id`) | A |
| REST / CRUD / códigos de estado | los 4 handlers del controlador | A |
| Receiving data from the client / json-parser | `createBook` (`request.body`) | A |
| Adding a new note (validación, `400`) | `createBook` | A |
| Fetching a non-existent resource (`404`) | `getBookById`, `deleteBook` | A |
| Handling Requests / `res.json` / `res.status` | todo el controlador | A |
| The Request-Response Cycle (`return`) | todo el controlador | A |
| Controllers / Naming Conventions | `controllers/bookController.js` | A |
| Testing the backend / REST Client | `requests/books.http` | A |
| Using a quick mock DB / `generateId` | `db.js` | B |
| Middlewares / Middleware order matters | `index.js` (orden) + `middlewares/` | Fase 0 / B |
| Implementing our own middlewares | `requestLogger` | B |
| Unknown endpoint | `unknownEndpoint` | B |
| Handling Errors in Express | `errorHandler` | B |
| Application-level middleware: `express.static` | `public/index.html`, `public/styles.css` | B |

---

## 14. Trampas conocidas (diferencias con las diapositivas)

- La ruta es **`/books`**, no `/api/books` como las notas de clase.
- El puerto es **3000** (en las diapositivas de notas es 3001).
- `DELETE` de un id inexistente da **404** (la diapositiva devuelve 204 en los dos casos).
- En las diapositivas, `unknownEndpoint` usa `.send(...)`; aquí se usa `.json(...)` para que sea JSON siempre.
- En **Express 5** `request.body` es `undefined` si la petición no trae JSON: desestructurar con `request.body ?? {}`.
- Sin `errorHandler`, un JSON mal formado devuelve una página HTML de error: el enunciado pide errores en JSON.
- `express.static('public')` busca la carpeta **relativa a donde se ejecuta** `node`: arrancar siempre desde `exercises/05`
  (que es lo que hace `npm run dev`).
- No usar `--env-file=.env` en los scripts: si el `.env` no existe, Node no arranca.
