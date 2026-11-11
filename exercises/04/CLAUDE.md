# Ejercicio 04 — React Mini Shop

Especificación del ejercicio 04 para Claude Code. La usan las dos personas del equipo:
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

## 1. Enunciado reorganizado (Módulo 04, "React: Mini Shop")

SPA de una tienda pequeña con React (Vite). Sin backend ni API: los productos están en `src/data/products.js`.
Va en `/exercises/04/` del repo. Debe demostrar:

- Componentes, props, renderizado condicional y listas (con `key`).
- Estado con `useState`, actualizado de forma **inmutable**.
- Componentes controlados y formularios.
- Routing en cliente con React Router (`createBrowserRouter`).
- Estado global con Context API (`createContext`, `Provider`, `useContext`).

### Requisitos por pantalla

| Pantalla / pieza | Requisito | `data-testid` |
|---|---|---|
| **Header** (en todas las páginas) | `<Link>` a inicio y a carrito | `nav-home`, `nav-cart` |
| | Total de **unidades** del carrito (suma de `quantity`, no filas) | `cart-count` |
| **Catálogo** `/` | Un contenedor por producto | `product-{id}` |
| | `<Link>` al detalle con el nombre como texto | `product-link-{id}` |
| | Precio | `price-{id}` |
| | Botón "Add to Cart" | `add-{id}` |
| | Input de búsqueda **controlado**, filtra por nombre sin distinguir mayúsculas | `search` |
| | Mensaje si no hay resultados | `no-results` |
| **Detalle** `/products/:id` | Nombre, precio, descripción y botón añadir | `product-name`, `product-price`, `product-description`, `add-to-cart` |
| | Funciona al abrir la URL directamente; id inexistente → mensaje | `product-not-found` |
| **Carrito** `/cart` | Una fila por producto (añadir dos veces = cantidad 2) | `cart-item-{id}` |
| | Cantidad de la fila | `quantity-{id}` |
| | Botones +, − (a 0 la fila desaparece) y quitar | `increase-{id}`, `decrease-{id}`, `remove-{id}` |
| | Precio total | `cart-total` |
| | Carrito vacío | `cart-empty` |
| **Checkout** (dentro del carrito) | Formulario **controlado**: input nombre + botón submit | `customer-name`, `checkout` |
| | Nombre vacío (o solo espacios) → no se hace el pedido | — |
| | Pedido hecho → se vacía el carrito y se muestra mensaje con el nombre | `order-confirmation` |
| **Error** | Cualquier URL desconocida (`errorElement`) | `not-found` |

Estructura de la app (diapositiva "Application Structure"):

```
<CartProvider>                       ← envuelve al router
  <RouterProvider>
    Layout (path "/")  = <Header /> + <Outlet />
      index            → Catalog
      products/:id     → ProductDetail
      cart             → Cart (+ checkout)
    errorElement       → NotFound
```

---

## 2. Estructura de carpetas y responsables

```
exercises/04/
├── CLAUDE.md                     → este archivo (no se toca sin avisar)
├── README.md                     → Fase 0 (base) / Fase 3 (final)
├── .nvmrc                        → Fase 0
├── package.json, package-lock.json, vite.config.js, index.html, eslint.config.js → Fase 0 (después NADIE los toca)
├── docs/
│   ├── RESUMEN_PERSONA_A.md      → A
│   ├── RESUMEN_PERSONA_B.md      → B
│   └── RESUMEN_GENERAL.md        → Fase 3
└── src/
    ├── main.jsx                  → Fase 0 (y luego nadie)
    ├── routes.jsx                → Fase 0 (y luego nadie)
    ├── index.css                 → A (estilos generales)
    ├── data/products.js          → Fase 0 (datos del contrato)
    ├── utils/formatPrice.js      → Fase 0 (contrato)
    ├── context/CartContext.jsx   → B (Fase 0 deja un stub)
    ├── components/Layout.jsx     → A
    ├── components/Header.jsx     → A
    ├── pages/Catalog.jsx         → A
    ├── pages/ProductDetail.jsx   → A
    ├── pages/NotFound.jsx        → A
    ├── pages/Cart.jsx            → B
    ├── pages/Cart.css            → B
    └── components/CheckoutForm.jsx → B
```

Tras la Fase 0, **A y B no comparten ningún archivo**. Así las dos ramas se mergean sin conflictos y en cualquier orden.

---

## 3. Contrato común (congelado)

**No se cambia sin avisar al compañero.** Si Claude cree que hay que cambiar algo de aquí, **para y se lo dice al usuario**.

### 3.1 Datos — `src/data/products.js`

```js
// id numérico. price en número (no string).
const products = [
  { id: 1, name: 'Laptop',   price: 999.99, description: 'Lightweight 14" laptop with 16 GB RAM.' },
  { id: 2, name: 'Mouse',    price: 25.5,   description: 'Wireless ergonomic mouse with silent clicks.' },
  { id: 3, name: 'Keyboard', price: 75,     description: 'Mechanical keyboard with backlit keys.' },
  { id: 4, name: 'Monitor',  price: 189.9,  description: '24" Full HD monitor with thin bezels.' },
];
export default products;
```

### 3.2 CartContext — `src/context/CartContext.jsx`

```js
export const CartContext   // createContext(...) con valores por defecto
export function CartProvider({ children })

// value del Provider:
cartItems                    // [{ id, name, price, quantity }]  — una fila por producto
addToCart(product)           // recibe el objeto producto completo; si ya está, quantity + 1
removeFromCart(id)           // quita la fila
updateQuantity(id, quantity) // si quantity <= 0, quita la fila
clearCart()                  // deja cartItems = []
```

- Los componentes lo leen con `useContext(CartContext)`, **nunca por props**.
- Se usa `<CartContext.Provider value={...}>` (la forma de las diapositivas).
- El archivo exporta el contexto y el componente a la vez. ESLint (`react-refresh/only-export-components`)
  puede dar un **aviso**: es esperado, **no reestructurar archivos** por eso.

### 3.3 Precios — `src/utils/formatPrice.js`

```js
// 25.5 → "$25.50". Se usa en catálogo, detalle y carrito para que todo coincida.
const formatPrice = (value) => `$${value.toFixed(2)}`;
export default formatPrice;
```

### 3.4 Rutas — `src/routes.jsx`

Array `routes` (patrón de la diapositiva "Refactoring the routes"); `main.jsx` hace `createBrowserRouter(routes)`.
El `errorElement` va en la ruta raíz `/`, y `Layout` tiene las rutas hijas (`index`, `products/:id`, `cart`).

### 3.5 Reglas de los `data-testid` (probablemente hay tests automáticos)

1. Se escriben **exactamente** como en la tabla de la sección 1.
2. Cada `data-testid` aparece **una sola vez** en la página (no repetir `product-name` en el catálogo, etc.).
3. Elementos con números "puros": `cart-count` y `quantity-{id}` contienen **solo el número** (`3`, no `Cart (3)`).
   Las etiquetas ("Cart", "Qty:") van fuera de ese elemento.
4. `price-{id}`, `product-price` y `cart-total` contienen **solo el precio formateado** con `formatPrice` (`$1050.99`).
5. `order-confirmation` contiene el nombre del cliente (por ejemplo, `Thank you for your order, Ada!`).

---

## 4. Norma de Git (OBLIGATORIA, por encima de cualquier otra instrucción)

1. **NUNCA** trabajar, hacer commit ni push en `main`. Antes de tocar nada: `git branch --show-current`.
   Si es `main`: `git pull` y `git checkout -b <rama>`. Si hay cambios sin commitear de otro ejercicio, **avisar** antes de crear la rama.
2. Ramas:
   - `ex04-esqueleto` → Fase 0
   - `ex04-persona-a` → Persona A
   - `ex04-persona-b` → Persona B
   - `ex04-resumen-general` → Fase 3
3. Commits pequeños con mensajes claros (`feat(ex04): ...`, `docs(ex04): ...`, `fix(ex04): ...`).
4. Al terminar: `git push -u origin <rama>` y abrir un **Pull Request contra `main`** (`gh pr create --base main` si existe `gh`;
   si no, dar al usuario el enlace). Título claro y descripción con qué se ha hecho y cómo probarlo.
5. **NUNCA** hacer merge del PR, `git merge` en `main` ni `git push --force`. **El merge lo hace el responsable del repo.**
6. **No añadir dependencias** después de la Fase 0 (nada de `npm install <paquete>`). Si hiciera falta, parar y avisar.

---

## 5. Plan y orden (exposición mañana)

| Fase | Quién | Qué | Tiempo aprox. |
|---|---|---|---|
| 0 | Una sola persona (recomendado: el responsable del repo) | Esqueleto que compila, con todas las rutas y el stub del contexto. PR → merge | 30 min |
| 1 | A y B **en paralelo**, cada uno desde `main` actualizado | Su parte + su resumen. PR cada uno → merge | 2-3 h |
| 2 | Los dos juntos | Checklist de integración (sección 11.3) sobre `main` | 30 min |
| 3 | Quien termine el último | `RESUMEN_GENERAL.md` + `README.md` final + guion de exposición | 45 min |
| — | Los dos | Ensayar la exposición con la demo | 30 min |

**Por qué hay Fase 0**: sin ella, A necesita el contexto y la página `Cart` de B para que compile el router, y B necesita
el proyecto Vite de A para poder empezar. Con el esqueleto, todo existe desde el principio (aunque vacío) y nadie espera a nadie.

---

## 6. Fase 0 — Esqueleto (rama `ex04-esqueleto`)

1. Crear el proyecto en una carpeta **vacía** para que Vite no pregunte nada (no es interactivo con Claude Code):
   ```bash
   cd exercises
   npm create vite@latest 04 -- --template react    # si 04/ ya existe con este CLAUDE.md, moverlo fuera antes y volver a ponerlo después
   cd 04 && npm install && npm install react-router-dom
   ```
   Si el comando pide confirmación interactiva, **parar y pedir al usuario que lo ejecute él** en su terminal.
2. `.nvmrc` con `v24.11.0` (diapositiva "Pinning the Node version").
3. Borrar lo que sobra de la plantilla: `App.jsx`, `App.css`, `src/assets/react.svg`. Vaciar `index.css` (A lo rellena).
4. Crear `src/data/products.js`, `src/utils/formatPrice.js` y `src/routes.jsx` según el contrato (sección 3).
5. `main.jsx`: `<StrictMode>` → `<CartProvider>` → `<RouterProvider router={router} />`. **No quitar `<StrictMode>`.**
6. Stub del contexto (B lo completa luego):
   ```jsx
   import { createContext, useState } from 'react';

   export const CartContext = createContext({
     cartItems: [], addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {},
   });

   export function CartProvider({ children }) {
     const [cartItems, setCartItems] = useState([]);
     // TODO Persona B: implementar de forma inmutable
     const addToCart = (product) => {};
     const removeFromCart = (id) => {};
     const updateQuantity = (id, quantity) => {};
     const clearCart = () => {};
     return (
       <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
         {children}
       </CartContext.Provider>
     );
   }
   ```
7. Páginas y componentes **placeholder** (un `<h1>` con "pendiente Persona X"): `Layout` (ya con `<Outlet />`),
   `Header`, `Catalog`, `ProductDetail`, `NotFound`, `Cart`, `CheckoutForm`.
8. `README.md` base: qué es, cómo arrancar (`nvm use`, `npm install`, `npm run dev`), estructura y reparto.
9. Verificar: `npm run build` sin errores y `npm run dev` navega a `/`, `/cart`, `/products/1` y `/xyz`.
10. Commit, push y PR. **Avisar a los dos de que no empiecen la Fase 1 hasta que esté mergeado.**

---

## 7. Persona A — Navegación y páginas de la tienda (rama `ex04-persona-a`)

Archivos: `src/components/Layout.jsx`, `src/components/Header.jsx`, `src/pages/Catalog.jsx`,
`src/pages/ProductDetail.jsx`, `src/pages/NotFound.jsx`, `src/index.css`, `docs/RESUMEN_PERSONA_A.md`.

- **`Layout`**: `<Header />` + `<main><Outlet /></main>`.
- **`Header`**: título "Mini Shop", `<Link to="/" data-testid="nav-home">` y `<Link to="/cart" data-testid="nav-cart">`.
  Lee `cartItems` con `useContext(CartContext)` y calcula las unidades con `reduce` (suma de `quantity`).
  Muestra el número en `<span data-testid="cart-count">`.
- **`NotFound`**: contenedor `data-testid="not-found"`, mensaje "404" y `<Link to="/">` para volver.
  Ojo: como `errorElement` de la raíz se pinta **sin** el Layout (sin header), por eso necesita su propio enlace.
- **`Catalog`**:
  - Estado `const [query, setQuery] = useState('')` y `<input data-testid="search" value={query} onChange={...} />` (componente controlado).
  - Filtrar con `filter` + `toLowerCase()` + `includes()`. El filtrado es una **variable calculada en el render**, no otro estado.
  - `map` de los productos filtrados con `key={product.id}`. Por cada uno: contenedor `product-{id}`,
    `<Link to={`/products/${id}`} data-testid="product-link-{id}">{name}</Link>`, precio con `formatPrice`,
    botón `add-{id}` con `onClick={() => addToCart(product)}` (arrow function, no `addToCart(product)` directo).
  - Si la lista filtrada está vacía → `<p data-testid="no-results">`.
  - Opcional (mejora la demo): reutilizar un componente `ProductCard` con props → crear `src/components/ProductCard.jsx` (también de A).
- **`ProductDetail`**:
  - `const { id } = useParams()` → **llega como string**: buscar con `products.find(p => p.id === Number(id))`.
  - Si no existe → `<p data-testid="product-not-found">` + `<Link to="/">`. Si existe → nombre, precio, descripción y botón `add-to-cart`.
  - Lee los productos importando `products.js` (no hace falta fetch), por eso funciona al abrir la URL directamente.
- **`index.css`**: estilos sencillos y limpios (cabecera, rejilla de tarjetas, botones). Sin librerías de CSS.
- **Probar en aislamiento** mientras B no ha terminado: el stub no añade nada al carrito. Para ver `cart-count`,
  se puede poner temporalmente un valor inicial en el `useState` del stub **sin commitearlo**. La prueba real es en la Fase 2.

---

## 8. Persona B — Estado global y carrito (rama `ex04-persona-b`)

Archivos: `src/context/CartContext.jsx`, `src/pages/Cart.jsx`, `src/pages/Cart.css`,
`src/components/CheckoutForm.jsx`, `docs/RESUMEN_PERSONA_B.md`.

- **`CartContext.jsx`** (completar el stub, sin cambiar la interfaz):
  - `addToCart(product)`: si ya existe, `map` + spread para crear una fila nueva con `quantity + 1`;
    si no, `concat({ id, name, price, quantity: 1 })` (o `[...cartItems, nuevo]`).
  - `removeFromCart(id)`: `filter`.
  - `updateQuantity(id, quantity)`: si `quantity <= 0` → `removeFromCart(id)`; si no, `map` + spread.
  - `clearCart()`: `setCartItems([])`.
  - **Prohibido** `push`, `splice`, `item.quantity++` o modificar objetos del array (diapositiva "Never Mutate State Directly").
- **`Cart.jsx`**:
  - Lee `cartItems`, `updateQuantity`, `removeFromCart` con `useContext`.
  - Una fila por producto con `key={item.id}`: `cart-item-{id}`, nombre, `quantity-{id}` (solo el número),
    botones `decrease-{id}` (`updateQuantity(id, quantity - 1)`), `increase-{id}` (`quantity + 1`) y `remove-{id}`.
  - Total con `reduce` (`price * quantity`) y `formatPrice` en `cart-total`.
  - Carrito vacío → `<p data-testid="cart-empty">`.
  - **Importante**: no hacer `return` temprano cuando el carrito está vacío, o desaparecería la confirmación del pedido.
    Usar renderizado condicional (`? :` / `&&`) dentro del mismo `return`.
- **Checkout** (`CheckoutForm.jsx`, usado dentro de `Cart`):
  - Estado `customerName` y `<input data-testid="customer-name" value={customerName} onChange={...} />`.
  - `<form onSubmit={handleSubmit}>` con `<button type="submit" data-testid="checkout">`.
  - `handleSubmit`: `e.preventDefault()`; si `customerName.trim() === ''` → no hacer nada (opcional: mensaje de error);
    si no → `clearCart()`, limpiar el input y avisar a `Cart` del nombre confirmado.
  - El nombre confirmado se guarda en un estado de **`Cart`** (`confirmedName`) y se pasa la función a `CheckoutForm`
    **por props** (`onOrderPlaced`), igual que en "Lifting State Up". Así `order-confirmation` se sigue viendo con el carrito vacío.
  - El formulario se muestra solo si hay productos; la confirmación se muestra siempre que haya `confirmedName`.
- **`Cart.css`**: estilos de la tabla/filas del carrito y del formulario.
- **Probar en aislamiento**: `Catalog` todavía es un placeholder. Para probar, se puede llamar temporalmente a
  `addToCart` desde un botón de prueba en `Cart.jsx` **y quitarlo antes del commit**, o usar React DevTools para editar el estado.

---

## 9. Reglas de código (para todo el ejercicio)

1. **Usar lo que está en el temario del Módulo 04**: componentes función, props y destructuring de props, JSX,
   `className`, `useState`, eventos (`onClick`, `onChange`, `onSubmit`), renderizado condicional (`if`, `? :`, `&&`),
   listas con `map` y `key`, `createContext`/`useContext`/`.Provider`, `createBrowserRouter`, `RouterProvider`,
   `Link`, `Outlet`, `useParams`, `errorElement`.
2. **No usar** (no salen en clase y no aportan aquí): `useReducer`, `useMemo`, `useCallback`, `useEffect`
   (no hay nada externo que sincronizar), `useNavigate`, `localStorage`, `axios`/`fetch`, TypeScript, librerías de UI o CSS.
   Si de verdad hiciera falta algo de fuera del temario, comentar qué hace y por qué, y mencionarlo en el resumen.
3. Navegar **siempre** con `<Link>`, nunca con `<a href>` (recarga la página y se pierde el carrito).
4. **`<StrictMode>` se queda.** En desarrollo, React ejecuta dos veces el render y las funciones que se pasan a `setState`.
   Por eso esas funciones tienen que ser **puras**: nada de mutar, ni llamar a otro `setX`, ni `console.log` con efectos,
   dentro de ellas. Si una cantidad sube de 2 en 2, el fallo es una mutación.
5. Pasar funciones a los eventos sin llamarlas: `onClick={() => addToCart(product)}`, no `onClick={addToCart(product)}`
   (provoca "Too many re-renders").
6. Componentes en PascalCase, un componente principal por archivo con `export default`.
7. **Comentarios en español** explicando el **porqué** y el concepto de React que se aplica
   (ej.: `// Componente controlado: el valor del input sale del estado`). Pensados para leerse en voz alta en la exposición.
   Sin comentar lo obvio.

---

## 10. Flujo de Claude cuando el usuario diga "soy la persona A/B"

1. **Comprobar** que la Fase 0 está mergeada en `main` (existen `src/routes.jsx` y el stub del contexto).
   Si no, parar y decirlo.
2. **Resumir** al usuario en pocas líneas su parte (archivos, qué hay que hacer, `data-testid`) y **pedir confirmación**.
3. **Git**: `git checkout main && git pull`, crear su rama (sección 4).
4. **Alcance**: tocar **solo** sus archivos (sección 2). Si necesita algo del otro, respetar el contrato; si hay que cambiarlo, parar y avisar.
5. **Implementar** con las reglas de la sección 9, un commit por pieza (ej.: Header → Catalog → ProductDetail).
6. **Verificar**: `npm run build` sin errores, `npm run dev` y su checklist (sección 11). Quitar cualquier código de prueba temporal.
7. **Documentar**: escribir `docs/RESUMEN_PERSONA_X.md` (sección 12.1) en la misma rama.
8. **Entregar**: push y PR contra `main` con descripción y cómo probarlo. **No mergear**: avisar de que está listo.

---

## 11. Checklists

### 11.1 Persona A

- [ ] `nav-home` y `nav-cart` navegan sin recargar (la pestaña no parpadea; el estado se mantiene).
- [ ] Hay un `product-{id}` por producto, con su `product-link-{id}`, `price-{id}` y `add-{id}`.
- [ ] Buscar `lap`, `LAP` y `Lap` muestra el Laptop; buscar `zzz` muestra `no-results`.
- [ ] `product-link-2` abre `/products/2` con nombre, precio y descripción del Mouse.
- [ ] Abrir `/products/2` escribiendo la URL directamente funciona.
- [ ] `/products/999` → `product-not-found`. `/loquesea` → `not-found`.
- [ ] `npm run build` sin errores.

### 11.2 Persona B

- [ ] `addToCart` dos veces con el mismo producto → una fila con `quantity` 2.
- [ ] `increase` / `decrease` cambian la cantidad; al llegar a 0 la fila desaparece. `remove` quita la fila.
- [ ] `cart-total` correcto: 1 Laptop + 2 Mouse = `$1050.99`.
- [ ] Carrito vacío → `cart-empty`.
- [ ] Checkout con nombre vacío o solo espacios → no pasa nada (el carrito sigue igual).
- [ ] Checkout con "Ada" → carrito vacío, `cart-empty` visible y `order-confirmation` contiene "Ada".
- [ ] No hay `push`, `splice` ni mutaciones (buscar en el código).
- [ ] `npm run build` sin errores.

### 11.3 Integración (los dos juntos, sobre `main` con todo mergeado)

- [ ] Añadir el Mouse desde el catálogo y desde el detalle → una sola fila con cantidad 2.
- [ ] `cart-count` cuenta unidades, no filas (2 Mouse + 1 Laptop = 3).
- [ ] Ir de catálogo → detalle → carrito → catálogo no vacía el carrito.
- [ ] Todos los puntos de 11.1 y 11.2 siguen funcionando juntos.
- [ ] Revisar todos los `data-testid` contra la tabla de la sección 1 (buscar `data-testid` en `src/`).
- [ ] La consola del navegador no muestra errores ni avisos de `key`.

---

## 12. Documentación para la exposición (OBLIGATORIA)

### 12.1 Resumen individual — `docs/RESUMEN_PERSONA_A.md` / `docs/RESUMEN_PERSONA_B.md`

Cada persona en su rama, dentro de su PR. Secciones:

1. **Qué se ha hecho** (3-5 líneas).
2. **Archivos y componentes** de los que es responsable (tabla: archivo → qué hace).
3. **Explicación paso a paso** de cada componente, pensada para contarla en voz alta: qué estado tiene,
   qué recibe por props o por contexto, qué pinta y qué pasa cuando el usuario interactúa.
4. **Conceptos del Módulo 04 aplicados** y dónde (archivo y línea/función), usando el mapa de la sección 13.
5. **Fragmentos clave** de código (los 2-3 más importantes) con su explicación.
6. **Decisiones tomadas y por qué** (ej.: por qué el filtrado no es estado; por qué `Number(id)`; por qué `map` + spread).
7. **Demo en vivo**: pasos exactos para enseñar su parte (qué pulsar y qué debe verse).
8. **5-6 preguntas probables del profesor con su respuesta**. Ejemplos:
   - A: ¿Qué diferencia hay entre `<Link>` y `<a>`? ¿Qué es un componente controlado? ¿Por qué el id de `useParams` es string?
     ¿Para qué sirve `<Outlet />`? ¿Qué hace `errorElement`? ¿Por qué cada elemento de la lista necesita `key`?
   - B: ¿Por qué no se puede usar `push` en el estado? ¿Qué problema resuelve Context frente a pasar props (prop drilling)?
     ¿Qué hace `e.preventDefault()`? ¿Por qué el `Provider` envuelve al router? ¿Por qué la confirmación es estado de `Cart`?
     ¿Qué hace `<StrictMode>` y por qué obliga a no mutar?

### 12.2 Resumen general — `docs/RESUMEN_GENERAL.md` (Fase 3, rama `ex04-resumen-general`)

Quien termine el último, con las dos partes ya en `main`:

1. **Visión global** del proyecto (qué es y qué demuestra del temario).
2. **Diagrama** del árbol de componentes y del flujo de datos en Mermaid (GitHub lo pinta), por ejemplo:
   ```mermaid
   flowchart TD
     CP[CartProvider<br/>cartItems + funciones] --> RP[RouterProvider]
     RP --> L[Layout]
     L --> H[Header<br/>lee cartItems]
     L --> O[Outlet]
     O --> C[Catalog<br/>addToCart]
     O --> D[ProductDetail<br/>addToCart]
     O --> K[Cart<br/>cartItems, updateQuantity,<br/>removeFromCart, clearCart]
     K --> F[CheckoutForm]
     RP -. URL desconocida .-> N[NotFound]
   ```
3. **Recorrido de un clic**: "Add to Cart" → `addToCart` → nuevo array en el estado del Provider → se re-renderizan
   Header (`cart-count`) y Cart.
4. **Cómo encajan las dos partes** a través del contrato (sección 3).
5. **Mapa temario → código** (sección 13, actualizada con los archivos reales).
6. **Guion de exposición** (8-10 min), repartido entre A y B:
   - Introducción y arquitectura (1 min, A).
   - Routing: rutas, Layout/Outlet, `useParams`, `errorElement` (2 min, A).
   - Catálogo: listas, `key`, búsqueda controlada (1-2 min, A).
   - Context: por qué, `createContext`/`Provider`/`useContext` (2 min, B).
   - Carrito: inmutabilidad, `map`/`filter`, total con `reduce` (1-2 min, B).
   - Checkout: formulario controlado, `preventDefault`, estado elevado (1 min, B).
   - Demo en vivo siguiendo la checklist 11.3 (2 min, los dos).
7. **Preguntas probables** juntando las de los dos resúmenes.

### 12.3 `README.md` final (Fase 3, misma rama)

Descripción, requisitos (`nvm use`), cómo arrancar y compilar, rutas, estructura de carpetas, reparto A/B
y enlaces a los tres resúmenes de `docs/`.

### 12.4 Pull Requests

Cada PR describe: qué incluye, archivos tocados, cómo probarlo (pasos) y enlace al resumen correspondiente.

---

## 13. Mapa temario (Módulo 04) → código

| Diapositiva | Dónde se usa | Quién |
|---|---|---|
| Getting started con Vite / `.nvmrc` | proyecto, `.nvmrc` | Fase 0 |
| StrictMode | `main.jsx` | Fase 0 |
| Componentes y props | `Layout`, `Header`, `CheckoutForm` (`onOrderPlaced`), `ProductCard` si existe | A / B |
| JSX: `className`, cerrar etiquetas | todos los componentes | A / B |
| Renderizado condicional | `no-results`, `product-not-found`, `cart-empty`, `order-confirmation` | A / B |
| Listas con `map` y `key` | `Catalog`, `Cart` | A / B |
| `useState` | búsqueda (`Catalog`), carrito (`CartProvider`), nombre y confirmación (checkout) | A / B |
| Never mutate state / spread / `concat` / `filter` | `addToCart`, `updateQuantity`, `removeFromCart` | B |
| Lifting state up | `confirmedName` en `Cart`, función pasada a `CheckoutForm` | B |
| Controlled components / forms / `preventDefault` | `search`, `customer-name` + `onSubmit` | A / B |
| React Router: `createBrowserRouter`, `RouterProvider` | `routes.jsx`, `main.jsx` | Fase 0 |
| `Link` | `Header`, `Catalog`, `NotFound`, `ProductDetail` | A |
| Nested routes + `Outlet` | `Layout` | A |
| Dynamic segments + `useParams` | `ProductDetail` | A |
| Handling bad URLs (`errorElement`) | `NotFound` | A |
| Context API: `createContext`, `Provider`, `useContext` | `CartContext.jsx`; consumido en Header, Catalog, ProductDetail, Cart | B (A consume) |

---

## 14. Cambios respecto a la versión anterior de este archivo

- Se añade la **regla 0**: Claude pregunta quién es el usuario antes de actuar (antes no lo sabía y hacía cosas de los dos).
- Se añade la **Fase 0 (esqueleto)**: rompe la dependencia circular (A necesitaba el stub y `Cart` de B; B necesitaba el proyecto de A).
- Todos los archivos tienen dueño, incluidos `package.json`, `index.html`, `index.css`, `App.jsx` (se borra) y el formato de precios.
- Git alineado con la norma del repo: PR siempre, nunca en `main`, el merge lo hace el responsable.
- Formato de precios y contenido de los `data-testid` fijados (evita que cada parte pinte cosas distintas).
- Aviso sobre `StrictMode` (funciones puras) y sobre `npm create vite` en carpetas no vacías.
- Sección de documentación para la exposición y mapa temario → código.
