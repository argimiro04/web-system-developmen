# Resumen Persona A — Navegación y páginas de la tienda

## 1. Qué se ha hecho

He construido todo lo que el usuario **ve y recorre** en la tienda, menos el carrito: el marco común
(`Layout` + `Header`), el catálogo con buscador, la página de detalle de cada producto y la página 404.
La navegación es 100 % en cliente con React Router (`<Link>`, `<Outlet />`, `useParams`, `errorElement`),
y las páginas leen y usan el carrito a través del **Context** que implementa la Persona B (`cartItems`, `addToCart`),
sin recibir nada por props.

## 2. Archivos y componentes

| Archivo | Qué hace |
|---|---|
| `src/components/Layout.jsx` | Marco común: `<Header />` fijo + `<Outlet />` donde se pinta la página de la URL |
| `src/components/Header.jsx` | Logo/enlace a inicio, enlace al carrito y contador de **unidades** (`cart-count`) |
| `src/components/ProductCard.jsx` | Tarjeta reutilizable de un producto (recibe `product` y `onAdd` por props) |
| `src/pages/Catalog.jsx` | Página `/`: buscador controlado, lista filtrada de tarjetas y mensaje `no-results` |
| `src/pages/ProductDetail.jsx` | Página `/products/:id`: lee el id de la URL y muestra el producto o `product-not-found` |
| `src/pages/NotFound.jsx` | `errorElement`: página 404 para cualquier URL desconocida |
| `src/index.css` | Estilos generales (cabecera, rejilla, tarjetas, botones, detalle, 404) |

## 3. Explicación paso a paso

### Layout
- **Estado**: ninguno. **Props**: ninguna.
- Es el `element` de la ruta padre `/` (en `routes.jsx`). Pinta siempre el `Header` y debajo un `<main>` con `<Outlet />`.
- `<Outlet />` es el hueco donde React Router coloca la ruta hija que coincide con la URL:
  `Catalog` en `/`, `ProductDetail` en `/products/2`, `Cart` en `/cart`. Así el Header no se repite en cada página.

### Header
- **Contexto**: lee `cartItems` con `useContext(CartContext)`.
- Calcula `totalUnits` con `reduce`, sumando la `quantity` de cada fila. Cuenta **unidades, no filas**:
  2 Mouse + 1 Laptop son 2 filas pero 3 unidades.
- Pinta dos `<Link>`: el logo "Mini Shop" (`nav-home`, va a `/`) y "Cart" (`nav-cart`, va a `/cart`).
  Dentro de este último, el número va solo en `<span data-testid="cart-count">`.
- **Interacción**: cuando cualquier página llama a `addToCart`, el Provider cambia `cartItems` y React vuelve a pintar
  el Header solo, sin que nadie se lo diga.

### ProductCard
- **Props**: `product` (objeto `{ id, name, price, ... }`) y `onAdd` (función).
- Pinta el contenedor `product-{id}`, el `<Link>` al detalle con el nombre (`product-link-{id}`),
  el precio con `formatPrice` (`price-{id}`) y el botón "Add to Cart" (`add-{id}`).
- **Interacción**: al pulsar el botón llama a `onAdd`. La tarjeta no sabe nada del carrito: solo avisa al padre.

### Catalog
- **Estado**: `query` (texto del buscador) con `useState('')`.
- **Contexto**: `addToCart`.
- Calcula `filteredProducts` en cada render: `filter` + `toLowerCase()` + `includes()`. No es otro estado.
- Pinta el `<input data-testid="search">` **controlado** (`value={query}` + `onChange`).
- Si `filteredProducts` está vacío → `<p data-testid="no-results">`; si no → rejilla con un `ProductCard` por producto
  (`map` con `key={product.id}`), pasándole `onAdd={() => addToCart(product)}`.
- **Interacción**: cada tecla llama a `setQuery`, React vuelve a renderizar y la lista se filtra al momento.

### ProductDetail
- **Estado**: ninguno. **Contexto**: `addToCart`. **Router**: `useParams()`.
- Saca `id` de la URL (`/products/2` → `"2"`), lo convierte con `Number(id)` y busca con `products.find`.
- Si no existe → `product-not-found` y un enlace al catálogo. Si existe → `product-name`, `product-price`,
  `product-description` y el botón `add-to-cart`.
- Como los productos se importan de `products.js`, la página funciona aunque se abra la URL directamente o se recargue.

### NotFound
- Es el `errorElement` de la ruta raíz. Cuando ninguna ruta coincide (`/loquesea`), React Router pinta NotFound
  **en lugar de todo el Layout**, así que no hay Header: por eso lleva su propio `<Link to="/">`.

## 4. Conceptos del Módulo 04 aplicados

| Concepto (diapositiva) | Dónde |
|---|---|
| Componentes y props (destructuring) | `ProductCard.jsx` — `ProductCard({ product, onAdd })`; `Layout.jsx` compone `Header` |
| JSX: `className`, etiquetas cerradas, `{}` | todos los componentes |
| Renderizado condicional (`? :` e `if`) | `Catalog.jsx:35` (`no-results`), `ProductDetail.jsx:19` (`product-not-found`) |
| Listas con `map` y `key` | `Catalog.jsx:41-43` |
| `useState` | `Catalog.jsx:8` (`query`) |
| Componente controlado | `Catalog.jsx:28-30` (`value` + `onChange`) |
| Eventos y pasar funciones sin llamarlas | `Catalog.jsx:47` (`() => addToCart(product)`), `ProductCard.jsx:18`, `ProductDetail.jsx:35` |
| `Link` | `Header.jsx:19,23`, `ProductCard.jsx:13`, `ProductDetail.jsx:23,38`, `NotFound.jsx:11` |
| Nested routes + `Outlet` | `Layout.jsx:12` |
| Dynamic segments + `useParams` | `ProductDetail.jsx:10` |
| Handling bad URLs (`errorElement`) | `NotFound.jsx` (registrado en `routes.jsx`) |
| Context API: `useContext` (consumo) | `Header.jsx:8`, `Catalog.jsx:10`, `ProductDetail.jsx:11` |
| Métodos de array (`filter`, `find`, `reduce`) | `Catalog.jsx:15`, `ProductDetail.jsx:16`, `Header.jsx:12` |

## 5. Fragmentos clave

### Buscador controlado y filtrado calculado (`Catalog.jsx`)

```jsx
const [query, setQuery] = useState('');

const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(query.toLowerCase()),
);

<input value={query} onChange={(e) => setQuery(e.target.value)} data-testid="search" />
```

El input no guarda su valor "por su cuenta": lo saca del estado (`value={query}`) y cada tecla lo actualiza
(`onChange`). Eso es un **componente controlado**. La lista filtrada no es estado: se deriva de `query` en cada render,
así que nunca puede quedarse desincronizada.

### El id de la URL es un string (`ProductDetail.jsx`)

```jsx
const { id } = useParams();                                  // "2"
const product = products.find((p) => p.id === Number(id));   // 2 === 2
if (!product) {
  return <p data-testid="product-not-found">Product not found.</p>;
}
```

Todo lo que sale de la URL es texto. Sin `Number(id)`, `"2" === 2` es `false` y nunca encontraría el producto.

### Contador de unidades desde el Context (`Header.jsx`)

```jsx
const { cartItems } = useContext(CartContext);
const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);
<span data-testid="cart-count">{totalUnits}</span>
```

El Header no recibe el carrito por props: lo lee del Provider. Suma `quantity`, no cuenta filas.

## 6. Decisiones tomadas y por qué

- **El filtrado no es estado**: se calcula a partir de `query`. Guardarlo en otro `useState` duplicaría la información
  (dos fuentes de verdad) y obligaría a sincronizarlas.
- **`Number(id)`**: `useParams` siempre devuelve strings y en `products.js` el id es número.
- **`ProductCard` aparte, con props**: separa "cómo se ve un producto" de "qué hace la página". La tarjeta recibe `onAdd`
  y no conoce el Context: así se ve claramente la diferencia entre **props** (padre → hijo) y **Context** (global).
- **`<Link>` siempre, nunca `<a href>`**: `<a>` recarga la página y el estado del carrito, que vive en memoria, se perdería.
- **`NotFound` con su propio enlace**: como `errorElement` sustituye al Layout entero, en la 404 no hay Header.
- **Return temprano en `ProductDetail`**: aquí sí se puede, porque si no hay producto no hay nada más que enseñar
  (al contrario que en `Cart`, donde B no puede hacerlo porque se perdería la confirmación del pedido).
- **Sin `useEffect` ni `fetch`**: los datos están en un archivo local, no hay nada externo que sincronizar.

## 7. Demo en vivo

1. `cd exercises/04 && npm run dev` y abrir `http://localhost:5173/`.
2. **Catálogo**: se ven 4 tarjetas (Laptop, Mouse, Keyboard, Monitor) con su precio (`$25.50`, etc.).
3. **Buscador**: escribir `lap` → solo Laptop. Borrar y escribir `LAP` → Laptop otra vez (no distingue mayúsculas).
   Escribir `zzz` → "No products match your search.". Borrar el texto.
4. **Add to Cart**: pulsar "Add to Cart" en Mouse → el número del Header sube (con la parte de B ya mergeada).
5. **Detalle**: pulsar el nombre "Mouse" → la URL cambia a `/products/2` **sin recargar** (el contador se mantiene).
   Se ven nombre, precio y descripción. Pulsar "Add to Cart" → el contador sube otra vez.
6. **URL directa**: escribir `localhost:5173/products/2` en la barra → la página carga igual.
7. **Producto inexistente**: `localhost:5173/products/999` → "Product not found." con el Header.
8. **404**: `localhost:5173/loquesea` → página 404 sin Header y botón "Back to the shop".
9. Enseñar en el código: `<Outlet />` en `Layout`, `useParams` + `Number(id)` en `ProductDetail`,
   y el `value`/`onChange` del buscador.

## 8. Preguntas probables del profesor

**¿Qué diferencia hay entre `<Link>` y `<a>`?**
`<a href>` hace que el navegador pida una página nueva al servidor: se recarga todo y se pierde el estado en memoria
(el carrito). `<Link>` cambia la URL con la History API y React Router pinta el componente nuevo sin recargar.

**¿Qué es un componente controlado?**
Un input cuyo valor lo decide el estado de React (`value={query}`) y que avisa de cada cambio con `onChange` para
actualizar ese estado. React es la única fuente de verdad del valor; así podemos usarlo en cada render para filtrar.

**¿Por qué el id de `useParams` es un string?**
Porque sale de la URL, y la URL es texto. Hay que convertirlo con `Number(id)` antes de compararlo con el id numérico
de `products.js`; si no, `"2" === 2` da `false`.

**¿Para qué sirve `<Outlet />`?**
Es el hueco donde la ruta padre (`Layout`) deja que se pinte la ruta hija que coincide con la URL. Gracias a él,
el Header se escribe una vez y se comparte entre todas las páginas.

**¿Qué hace `errorElement`?**
Es el componente que React Router pinta si algo falla en esa ruta o en sus hijas, incluida una URL que no coincide con
ninguna ruta. Lo pusimos en la raíz con `NotFound`. Sustituye al Layout, por eso NotFound tiene su propio enlace.

**¿Por qué cada elemento de la lista necesita `key`?**
Para que React identifique cada elemento entre renders. Al filtrar, los elementos cambian de posición; con una `key`
estable (el `id`) React sabe qué tarjeta es cuál y no reutiliza la equivocada. El índice del array no vale porque cambia al filtrar.

**¿Por qué el resultado del filtro no está en un `useState`?**
Porque se puede calcular a partir de `query` y `products`. Si fuera estado, habría que actualizarlo a mano cada vez que
cambie la búsqueda, y podría desincronizarse.
