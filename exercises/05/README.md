# Ejercicio 05 — Books REST API

API REST con Express para gestionar una lista de libros `{ id, title, author }`.
Los datos se guardan en memoria (sin base de datos).

## Cómo arrancar

```bash
nvm use          # Node v24.11.0 (.nvmrc)
npm install
npm run dev      # http://localhost:3000
npm run lint
```

## Endpoints

| Endpoint | Éxito | Errores |
|---|---|---|
| `GET /books` | `200` + array de libros | — |
| `POST /books` | `201` + libro creado | `400` si falta `title` o `author` |
| `GET /books/:id` | `200` + libro | `404` si no existe |
| `DELETE /books/:id` | `204` | `404` si no existe |

Cualquier otra ruta devuelve `404` con `{ "error": "unknown endpoint" }`. En `/` hay una página de bienvenida.

## Estructura y reparto

```
index.js                     → servidor y orden de middlewares (Fase 0)
routes/bookRoutes.js         → rutas de /books (Fase 0)
controllers/bookController.js → handlers de la API (Persona A)
requests/books.http          → peticiones de prueba (Persona A)
db.js                        → datos en memoria (Persona B)
middlewares/                 → logger, unknownEndpoint, errorHandler (Persona B)
public/                      → página de bienvenida (Persona B)
docs/                        → resúmenes para la exposición
```

Detalles en `CLAUDE.md`.
