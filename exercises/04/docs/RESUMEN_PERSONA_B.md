# Resumen Persona B — Estado global y carrito

## 1. Qué se ha hecho

He implementado el **estado global del carrito** con Context API y todo lo que pasa en la página `/cart`.
`CartProvider` guarda el carrito en un `useState` y reparte el carrito y sus cuatro funciones
(`addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`) a toda la app, siempre actualizándolo de forma
**inmutable**. Encima de eso, la página `Cart` pinta las filas, cantidades y total, y `CheckoutForm` es un formulario
controlado que hace el pedido, vacía el carrito y muestra la confirmación con el nombre del cliente.

## 2. Archivos y componentes

| Archivo | Qué hace |
|---|---|
| `src/context/CartContext.jsx` | `CartContext` + `CartProvider`: estado del carrito y las 4 funciones, todas inmutables |
| `src/pages/Cart.jsx` | Página `/cart`: filas con +/−/Remove, total, carrito vacío y mensaje de pedido confirmado |
| `src/components/CheckoutForm.jsx` | Formulario controlado (nombre + Checkout) con `preventDefault` y validación |
| `src/pages/Cart.css` | Estilos de las filas del carrito, botones, total, formulario y confirmación |

## 3. Explicación paso a paso

### CartContext / CartProvider
- `createContext({...})` crea el contexto con valores por defecto (solo se usan si alguien lo lee fuera del Provider).
- **Estado**: `const [cartItems, setCartItems] = useState([])`. Cada fila es `{ id, name, price, quantity }`.
- El Provider está en `main.jsx` **por encima del router**: el carrito no pertenece a ninguna página,
  así que navegar entre `/`, `/products/2` y `/cart` no lo borra.
- Funciones (todas crean un array **nuevo**, nunca tocan el actual):
  - `addToCart(product)`: si el producto ya está (`find`), `map` y la fila de ese id se sustituye por
    `{ ...item, quantity: item.quantity + 1 }`. Si no está, `concat({ id, name, price, quantity: 1 })`.
    Resultado: añadir dos veces el mismo producto da **una fila con cantidad 2**.
  - `removeFromCart(id)`: `filter` con todas las filas menos esa.
  - `updateQuantity(id, quantity)`: si `quantity <= 0` llama a `removeFromCart`; si no, `map` + spread con la nueva cantidad.
  - `clearCart()`: `setCartItems([])`.
- `<CartContext.Provider value={{ cartItems, addToCart, ... }}>` reparte todo. Lo consumen con `useContext`:
  Header (`cartItems`), Catalog y ProductDetail (`addToCart`), Cart y CheckoutForm.

### Cart
- **Contexto**: `cartItems`, `updateQuantity`, `removeFromCart`.
- **Estado propio**: `confirmedName` (el nombre del último pedido).
- `total` se calcula en cada render con `reduce` (`price * quantity`), no es estado.
- Pinta, en un único `return` con renderizado condicional:
  - `confirmedName && <p data-testid="order-confirmation">` → el mensaje del pedido.
  - Si `cartItems.length === 0` → `<p data-testid="cart-empty">` y un `<Link>` al catálogo.
  - Si no → la lista (`map` con `key={item.id}`), el total y el `CheckoutForm`.
- Cada fila: nombre, botones `decrease-{id}` / `increase-{id}` (llaman a `updateQuantity` con `quantity ∓ 1`),
  `quantity-{id}` (solo el número), subtotal y `remove-{id}`.

### CheckoutForm
- **Props**: `onOrderPlaced` (la función `setConfirmedName` del padre).
- **Estado**: `customerName` (input controlado) y `error`.
- `handleSubmit(e)`: `e.preventDefault()` → `trim()` del nombre → si queda vacío, muestra error y no hace nada →
  si no, `clearCart()`, `onOrderPlaced(nombre)` y limpia el input.

## 4. Conceptos del Módulo 04 aplicados

| Concepto (diapositiva) | Dónde |
|---|---|
| Context API: `createContext`, `.Provider`, `useContext` | `CartContext.jsx`; `useContext` en `Cart.jsx` y `CheckoutForm.jsx` |
| `useState` | `cartItems` (`CartProvider`), `confirmedName` (`Cart`), `customerName` y `error` (`CheckoutForm`) |
| Never mutate state / object spread | `addToCart` y `updateQuantity`: `{ ...item, quantity: ... }` |
| Handling arrays in the state (`concat`) | `addToCart` (producto nuevo) |
| `filter` | `removeFromCart` |
| `map` (actualizar un elemento, patrón de `toggleImportanceOf`) | `addToCart` y `updateQuantity` |
| Listas con `map` y `key` | `Cart.jsx`, `cartItems.map(...)` con `key={item.id}` |
| Renderizado condicional (`? :`, `&&`) | `Cart.jsx` (`cart-empty` / lista, `order-confirmation`), error de `CheckoutForm` |
| Controlled components / forms / `preventDefault` | `CheckoutForm.jsx` (`value` + `onChange`, `onSubmit`) |
| Lifting state up / pasar funciones por props | `confirmedName` en `Cart`, `onOrderPlaced` a `CheckoutForm` |
| Componentes con props y destructuring | `CheckoutForm({ onOrderPlaced })` |
| Pasar la función sin llamarla (`() => ...`) | botones +, −, Remove en `Cart.jsx` |

## 5. Fragmentos clave

**Añadir sin mutar** (`CartContext.jsx`):

```jsx
if (alreadyInCart) {
  setCartItems(
    cartItems.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    ),
  );
} else {
  const { id, name, price } = product;
  setCartItems(cartItems.concat({ id, name, price, quantity: 1 }));
}
```
`map` devuelve un array nuevo; la fila que cambia es un objeto nuevo (spread) y el resto se reutilizan.
Nunca `push` ni `item.quantity++`.

**La confirmación sobrevive al carrito vacío** (`Cart.jsx`):

```jsx
const [confirmedName, setConfirmedName] = useState('');
...
{confirmedName && <p data-testid="order-confirmation">Thank you for your order, {confirmedName}!</p>}
{cartItems.length === 0 ? <p data-testid="cart-empty">...</p> : (<> ... <CheckoutForm onOrderPlaced={setConfirmedName} /> </>)}
```

**Formulario controlado** (`CheckoutForm.jsx`):

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  const name = customerName.trim();
  if (name === '') { setError('Please enter your name.'); return; }
  clearCart();
  onOrderPlaced(name);
  setCustomerName('');
};
```

## 6. Decisiones tomadas y por qué

- **`map` + spread / `concat` / `filter` en lugar de `push`/`splice`**: React compara referencias para saber si el estado
  cambió; si mutamos el mismo array no se entera. Además `<StrictMode>` ejecuta dos veces algunas funciones en desarrollo,
  y una mutación haría que la cantidad subiera de 2 en 2.
- **`updateQuantity` con cantidad ≤ 0 llama a `removeFromCart`**: así el botón − no necesita saber nada; la regla
  "a 0 la fila desaparece" vive en un único sitio.
- **En el carrito guardo `{ id, name, price, quantity }`** y no el producto entero: es lo que dice el contrato y lo que
  necesita la página (la descripción no se usa).
- **`confirmedName` en `Cart` y no en `CheckoutForm`**: el formulario solo se pinta si hay productos; tras el pedido el
  carrito queda vacío y el formulario desaparece. Si el mensaje viviera dentro del formulario, desaparecería con él.
- **Sin `return` temprano** en `Cart` cuando está vacío, por el mismo motivo.
- **El total no es estado**: sale de `cartItems` con `reduce`. Guardarlo aparte sería estado redundante que podría
  desincronizarse (diapositiva "Final Clean Up": evitar estado redundante).
- **`trim()`** en el nombre: "   " no cuenta como nombre.

## 7. Demo en vivo

1. `npm run dev` y abrir `http://localhost:5173`.
2. Pulsar "Add to Cart" del **Mouse** dos veces y del **Laptop** una → el contador del header marca **3**.
3. Abrir el detalle del Mouse y pulsar "Add to Cart" → contador **4**.
4. Ir a **Cart**: una fila Mouse con cantidad **3** (no tres filas) y una Laptop con **1**.
5. Pulsar **−** en Mouse → 2. Total: **$1050.99**.
6. Pulsar **+** y luego **−** dos veces en Laptop → al llegar a 0 la fila desaparece.
7. Escribir solo espacios y pulsar **Checkout** → mensaje "Please enter your name." y el carrito sigue igual.
8. Escribir **Ada** y pulsar **Checkout** → carrito vacío, "Your cart is empty." y "Thank you for your order, Ada!".
9. (Extra) Abrir React DevTools → Components → `CartProvider` para enseñar el estado `cartItems` cambiando.

## 8. Preguntas probables del profesor

- **¿Por qué no se puede usar `push` en el estado?**
  `push` modifica el mismo array. React decide si re-renderizar comparando la referencia del estado anterior con la nueva:
  si es el mismo array, puede no enterarse. Además rompe cosas como el "time travel" o StrictMode. Por eso creamos
  siempre un array nuevo con `concat`, `map` o `filter`.
- **¿Qué problema resuelve Context frente a pasar props?**
  El *prop drilling*: sin Context, `App` tendría que pasar `cartItems` y `addToCart` por props a Header, Catalog,
  ProductDetail y Cart (y a sus hijos). Con el Provider, cualquier componente dentro lo lee con `useContext`.
- **¿Qué hace `e.preventDefault()`?**
  Evita la acción por defecto del `submit`: enviar el formulario y recargar la página. Sin él, la página se recargaría
  y perderíamos el carrito y el mensaje.
- **¿Por qué el `Provider` envuelve al router?**
  Para que el carrito esté por encima de todas las rutas. Al cambiar de página se desmonta la página anterior,
  pero el Provider sigue montado, así que el carrito no se pierde.
- **¿Por qué la confirmación es estado de `Cart` y no del formulario?**
  Es *lifting state up*: tras el pedido el carrito se vacía y el formulario deja de pintarse. Si el mensaje fuera del
  formulario se iría con él. `Cart` guarda el nombre y le pasa a `CheckoutForm` la función para avisarle.
- **¿Qué hace `<StrictMode>` y por qué obliga a no mutar?**
  En desarrollo ejecuta dos veces el render y las funciones de actualización para destapar código impuro. Si mutáramos
  (`item.quantity++`), la cantidad subiría 2 por clic. Con copias (`{ ...item, quantity: item.quantity + 1 }`) el
  resultado es el mismo aunque se ejecute dos veces.
- **¿Qué es un componente controlado?**
  Un input cuyo `value` sale del estado de React y que actualiza ese estado con `onChange`. React es la única fuente de
  verdad del valor (así podemos validarlo y limpiarlo con `setCustomerName('')`).
