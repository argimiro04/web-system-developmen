# Ejercicio 04 — React Mini Shop

SPA de una tienda pequeña hecha con **React + Vite** (Módulo 04). No hay backend: los productos están en
`src/data/products.js`. Se puede navegar por el catálogo, buscar productos, ver su detalle, gestionar el carrito
y hacer un pedido.

Demuestra: componentes y props, renderizado condicional, listas con `key`, `useState` con actualizaciones
**inmutables**, formularios **controlados**, React Router (`createBrowserRouter`, `Link`, `Outlet`, `useParams`,
`errorElement`) y estado global con **Context API**.

## Requisitos

- Node **v24.11.0** (fijado en `.nvmrc`). Con nvm:

```bash
nvm use
```

## Cómo arrancar y compilar

```bash
cd exercises/04
npm install
npm run dev      # servidor de desarrollo → http://localhost:5173
npm run build    # compilación de producción en dist/
npm run preview  # sirve la build de dist/
npm run lint     # oxlint (los avisos de CartContext.jsx son esperados)
```

## Rutas

| URL | Página | Qué muestra |
|---|---|---|
| `/` | `Catalog` | Productos, buscador y botón "Add to Cart" |
| `/products/:id` | `ProductDetail` | Nombre, precio, descripción y "Add to Cart" (o "Product not found") |
| `/cart` | `Cart` | Filas del carrito, cantidades, total y checkout |
| cualquier otra | `NotFound` | Página 404 (`errorElement`) |

## Estructura

```
exercises/04/
├── CLAUDE.md                     especificación del ejercicio (reparto, contrato, git)
├── README.md                     este archivo
├── .nvmrc                        versión de Node
├── docs/
│   ├── RESUMEN_PERSONA_A.md      explicación de la parte A
│   ├── RESUMEN_PERSONA_B.md      explicación de la parte B
│   └── RESUMEN_GENERAL.md        visión global, diagrama y guion de exposición
└── src/
    ├── main.jsx                  StrictMode > CartProvider > RouterProvider
    ├── routes.jsx                array de rutas (Layout + hijas, errorElement)
    ├── index.css                 estilos generales (A)
    ├── data/products.js          productos (contrato)
    ├── utils/formatPrice.js      25.5 → "$25.50" (contrato)
    ├── context/CartContext.jsx   estado global del carrito (B)
    ├── components/
    │   ├── Layout.jsx            Header + Outlet (A)
    │   ├── Header.jsx            navegación y contador de unidades (A)
    │   ├── ProductCard.jsx       tarjeta de producto con props (A)
    │   └── CheckoutForm.jsx      formulario de pedido controlado (B)
    └── pages/
        ├── Catalog.jsx           catálogo con buscador (A)
        ├── ProductDetail.jsx     detalle por id con useParams (A)
        ├── NotFound.jsx          404 (A)
        ├── Cart.jsx              carrito y confirmación del pedido (B)
        └── Cart.css              estilos del carrito (B)
```

## Reparto

| Persona | Responsabilidad | Archivos |
|---|---|---|
| **A** | Navegación y páginas de la tienda | `Layout`, `Header`, `ProductCard`, `Catalog`, `ProductDetail`, `NotFound`, `index.css` |
| **B** | Estado global y carrito | `CartContext`, `Cart`, `Cart.css`, `CheckoutForm` |
| Fase 0 | Esqueleto y contrato común | proyecto Vite, `main.jsx`, `routes.jsx`, `products.js`, `formatPrice.js` |

Las dos partes se comunican solo a través del contrato del `CartContext` (`cartItems`, `addToCart`, `removeFromCart`,
`updateQuantity`, `clearCart`), así que no comparten ningún archivo.

## Documentación

- [Resumen de la Persona A](./docs/RESUMEN_PERSONA_A.md) — routing, catálogo, detalle y 404.
- [Resumen de la Persona B](./docs/RESUMEN_PERSONA_B.md) — Context, carrito inmutable y checkout.
- [Resumen general](./docs/RESUMEN_GENERAL.md) — diagrama, recorrido de un clic, mapa temario → código y guion de exposición.
