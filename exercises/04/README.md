# Ejercicio 04 — React Mini Shop

SPA de una tienda pequeña hecha con **React + Vite** (Módulo 04). No hay backend: los productos están en
`src/data/products.js`. Demuestra componentes y props, renderizado condicional, listas con `key`, `useState`
con actualizaciones inmutables, formularios controlados, React Router (`createBrowserRouter`) y Context API.

> Estado: **Fase 0 (esqueleto)**. Las páginas son placeholders; cada persona las completa en su rama.
> La especificación completa está en [`CLAUDE.md`](./CLAUDE.md).

## Cómo arrancar

```bash
nvm use          # usa la versión de Node de .nvmrc (v24.11.0)
npm install
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # compilación de producción en dist/
```

## Rutas

| URL | Página |
|---|---|
| `/` | `Catalog` |
| `/products/:id` | `ProductDetail` |
| `/cart` | `Cart` (con el checkout) |
| cualquier otra | `NotFound` (`errorElement`) |

## Estructura

```
src/
├── main.jsx                  StrictMode > CartProvider > RouterProvider
├── routes.jsx                array de rutas (Layout + hijas, errorElement)
├── index.css                 estilos generales (A)
├── data/products.js          productos (contrato)
├── utils/formatPrice.js      25.5 → "$25.50" (contrato)
├── context/CartContext.jsx   estado global del carrito (B)
├── components/
│   ├── Layout.jsx            Header + Outlet (A)
│   ├── Header.jsx            navegación y contador (A)
│   └── CheckoutForm.jsx      formulario de pedido (B)
└── pages/
    ├── Catalog.jsx           catálogo con buscador (A)
    ├── ProductDetail.jsx     detalle por id (A)
    ├── NotFound.jsx          404 (A)
    └── Cart.jsx              carrito (B)
```

## Reparto

- **Persona A** (rama `ex04-persona-a`): navegación y páginas de la tienda — `Layout`, `Header`, `Catalog`,
  `ProductDetail`, `NotFound`, `index.css`.
- **Persona B** (rama `ex04-persona-b`): estado global y carrito — `CartContext`, `Cart`, `Cart.css`, `CheckoutForm`.

Tras este esqueleto, A y B no comparten ningún archivo: las dos ramas se pueden mergear en cualquier orden.
