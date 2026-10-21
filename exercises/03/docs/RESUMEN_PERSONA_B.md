# Resumen Persona B: datos, cálculo y pintado

## 1. Qué se ha hecho

La Persona B se encarga de lo que pasa después de validar un gasto: guardarlo, calcular el total y
pintarlo en la página. La Persona A llama a `addExpense(name, amount)` y a `render()`, y mi parte se
encarga de todo lo demás. También he escrito la versión final del `README.md`.

**Fase 1**: versión básica que cumple el enunciado (añadir, listar y calcular el total).

**Fase 2 (alineación con el temario)**: he cambiado el código para usar lo que se ha visto en el Módulo 03
y he añadido dos funcionalidades:

| Antes (Fase 1) | Ahora (Fase 2) | Diapositiva del temario |
|---|---|---|
| `expenses.push(expense)` | `expenses = expenses.concat(expense)` | Immutable Arrays |
| `crypto.randomUUID()` | Contador numérico `let nextId` | Variables (`let`) |
| `list.replaceChildren()` | `list.innerHTML = ''` (solo para vaciar) | Manipulating Selected Elements |
| `list.append(...items)` con `map` | `forEach` + `appendChild` | DOM Manipulation |
| — | Botón **Borrar** con `removeExpense(id)` y `filter` | Useful Array Methods, Event Handling |
| — | Persistencia con `JSON.stringify` / `JSON.parse` en `localStorage` | Working with JSON |
| — | `console.error` si el JSON guardado está corrupto | Console API |

## 2. Archivos y funciones

| Archivo | Función | Qué hace |
|---|---|---|
| `src/expenses.js` | `addExpense(name, amount)` | Crea `{ id, name, amount }`, lo añade con `concat` y guarda |
| `src/expenses.js` | `removeExpense(id)` | Quita el gasto con ese `id` usando `filter` y guarda |
| `src/expenses.js` | `getExpenses()` | Devuelve una **copia** del array de gastos |
| `src/expenses.js` | `getTotal()` | Suma los importes con `reduce` (`0` si no hay gastos) |
| `src/expenses.js` | `loadExpenses()` (interna) | Lee y convierte el JSON de `localStorage`; si falla, devuelve `[]` |
| `src/expenses.js` | `saveExpenses()` (interna) | Guarda el array en `localStorage` con `JSON.stringify` |
| `src/render.js` | `render()` | Vacía `#expense-list`, crea un `<li>` por gasto y escribe el total en `#total` |
| `src/render.js` | `createExpenseItem(expense)` (interna) | Crea el `<li>` de un gasto con su botón de borrar |
| `README.md` | — | Descripción, cómo arrancarlo, estructura, flujo y reparto |

## 3. Explicación paso a paso (para contarla en voz alta)

### `expenses.js`: el estado

1. **Carga inicial** (`loadExpenses`):
   1. `localStorage.getItem('budget-tracker-expenses')` devuelve el texto guardado, o `null` si no hay nada.
   2. `JSON.parse` convierte ese texto en un array de objetos. `JSON.parse(null)` devuelve `null`.
   3. Con `Array.isArray(saved)` comprobamos que de verdad es una lista. Si no lo es, empezamos con `[]`.
   4. Todo va dentro de un `try/catch`: si el texto no es JSON válido, `JSON.parse` lanza un error,
      lo mostramos con `console.error` y empezamos con `[]`. La app nunca se rompe por culpa de lo guardado.
2. `let expenses = loadExpenses()`. Es `let` porque en cada cambio asignamos un **array nuevo**.
3. **`nextId`**: con `reduce` buscamos el `id` mayor de los gastos cargados y le sumamos 1.
   Así, si al recargar tenemos los ids 1 y 3, el siguiente gasto tendrá el 4 y nunca se repite un id.
4. **`saveExpenses`**: `JSON.stringify(expenses)` convierte el array en texto y lo guardamos con `setItem`.
   `localStorage` solo guarda texto, por eso hace falta JSON.
5. **`addExpense`**: crea `{ id: nextId, name, amount }` (forma abreviada de objetos), incrementa `nextId`,
   hace `expenses = expenses.concat(expense)` y guarda.
6. **`removeExpense(id)`**: `expenses = expenses.filter((expense) => expense.id !== id)` se queda con
   todos los gastos menos el que borramos, y guarda.
7. **`getExpenses`**: devuelve `[...expenses]`, una copia con spread.
8. **`getTotal`**: `expenses.reduce((sum, { amount }) => sum + amount, 0)`, con destructuring de `amount`.
   Empieza en `0`, así que con la lista vacía devuelve `0`.

### `render.js`: el pintado

1. Guardamos las referencias a `#expense-list` y `#total` con `getElementById`.
2. **`createExpenseItem`** es una arrow function que recibe un gasto (con destructuring `{ id, name, amount }`)
   y devuelve un `<li>` con tres hijos:
   - un `<span>` con el nombre (`textContent`);
   - un `<span>` con el importe (`` `${amount.toFixed(2)} €` ``);
   - un `<button>` con `type="button"` (para que no envíe el formulario) y la clase `delete-btn`.
     Su `addEventListener('click', ...)` llama a `removeExpense(id)` y después a `render()`.
     La arrow function "recuerda" el `id` de su gasto (es un *closure*).
3. **`render()`**:
   1. `list.innerHTML = ''` vacía la lista. Es el único uso de `innerHTML`, y nunca con datos del usuario.
   2. `getExpenses().forEach(...)` recorre los gastos y cuelga cada `<li>` con `appendChild`,
      igual que en la diapositiva "DOM Manipulation".
   3. `total.textContent = getTotal().toFixed(2)` muestra el total con dos decimales (`20` → `"20.00"`).

### Seguridad: `textContent` y no `innerHTML`

El nombre lo escribe el usuario. Si usáramos `innerHTML` para pintarlo, un nombre como
`<img src=x onerror=alert(1)>` se interpretaría como HTML y ejecutaría código (**XSS**).
Con `createElement` + `textContent` el texto se muestra tal cual, sin interpretarlo nunca.

## 4. Conceptos del Módulo 03 aplicados

| Concepto | Dónde |
|---|---|
| `const` / `let` | `const STORAGE_KEY`; `let expenses` y `let nextId` (se reasignan) |
| Immutable arrays (`concat`) | `addExpense()` |
| `filter` | `removeExpense()` |
| `reduce` | `getTotal()` y el cálculo inicial de `nextId` |
| `forEach` | `render()` |
| Spread | `getExpenses()`: `[...expenses]` |
| Destructuring | `getTotal()`: `({ amount })`; `nextId`: `({ id })`; `createExpenseItem`: `({ id, name, amount })` |
| Arrow functions | `loadExpenses`, `saveExpenses`, `createExpenseItem`, callbacks de `filter`/`reduce`/`forEach`/`click` |
| Objetos literales (forma abreviada) | `addExpense`: `{ id: nextId, name, amount }` |
| Template literals | `render.js`: `` `${amount.toFixed(2)} €` `` |
| DOM: selección y manipulación | `getElementById`, `createElement`, `textContent`, `appendChild`, `setAttribute`, `classList` |
| Event handling | `addEventListener('click', ...)` del botón de borrar |
| JSON | `JSON.stringify` en `saveExpenses()`, `JSON.parse` en `loadExpenses()` |
| Console API | `console.error` cuando el JSON guardado está corrupto |
| Módulos `import` / `export` | `expenses.js` exporta (named); `render.js` y `main.js` importan con llaves |

## 5. Decisiones tomadas y por qué

- **`concat` en vez de `push`**: `push` modifica el array original; `concat` devuelve uno nuevo y deja
  el original intacto. Es la idea de **inmutabilidad** del temario y la forma en que React espera que se
  actualice el estado (el siguiente módulo).
- **Contador numérico en vez de `crypto.randomUUID()`**: es más sencillo, se ve en clase y los ids se leen
  fácilmente en el JSON guardado. Para que no se repitan tras recargar, continúa desde el `id` mayor.
- **Estado privado en el módulo**: el array no se exporta. Solo se cambia con `addExpense` y `removeExpense`,
  que además se encargan de guardar. Así el estado y `localStorage` siempre coinciden.
- **`try/catch` + `console.error` al cargar**: si alguien edita `localStorage` a mano y lo deja mal,
  la app arranca vacía en vez de romperse, y en la consola queda el motivo.
- **`Array.isArray`**: no sale en las diapositivas, pero hace falta para comprobar que lo guardado es una lista
  (por ejemplo, si `JSON.parse` devuelve `null` porque no había nada).
- **`render()` repinta toda la lista**: es lo más sencillo y siempre refleja el estado exacto,
  sea cual sea el cambio (añadir o borrar). Es el enfoque declarativo de React.
- **`innerHTML = ''` solo para vaciar**: no hay riesgo de XSS porque no lleva datos del usuario.
- **`type="button"` en el botón de borrar**: un `<button>` sin tipo dentro de un formulario lo enviaría.
  Aquí está fuera del formulario, pero así queda claro y es seguro si cambia el HTML.

## 6. Cómo hacer la demo en vivo

1. `cd exercises/03`, `npm install` y `npm run dev`, y abrir http://localhost:5173.
2. Al cargar: la lista dice "Todavía no hay gastos." y el total es `0.00`.
3. Añadir Café 10, Pan 5.5 y Leche 4.5 → aparecen en orden y el total es `20.00`.
4. Pulsar **Borrar** en Pan → desaparece y el total pasa a `14.50`.
5. **Recargar la página (F5)** → los gastos siguen ahí. Explicar `JSON.stringify` y `JSON.parse`.
6. DevTools → Application → Local Storage → enseñar la clave `budget-tracker-expenses` con el JSON.
7. Cambiar a mano ese valor por `hola` y recargar → la lista sale vacía y en Console aparece el `console.error`.
8. Añadir un gasto con nombre `<b>hola</b>` → se ve el texto literal, no en negrita. Explicar `textContent` y XSS.

## 7. Posibles preguntas del profesor

1. **¿Por qué `concat` y no `push`?**
   `push` modifica el array original. `concat` devuelve un array nuevo con el elemento añadido y deja el
   original igual. Es programación inmutable, que es como React espera que se actualice el estado.
2. **Si usas inmutabilidad, ¿por qué `expenses` es `let`?**
   Porque no cambiamos el array, sino **qué array** guarda la variable: cada cambio crea uno nuevo
   (`concat`, `filter`) y lo asignamos a `expenses`. Con `const` no podríamos reasignarlo.
3. **¿Qué hace `JSON.stringify` y por qué hace falta?**
   Convierte un objeto o array de JavaScript en un texto con formato JSON. `localStorage` solo guarda texto,
   así que lo convertimos al guardar y lo recuperamos con `JSON.parse` al cargar.
4. **¿Qué pasa si lo guardado en `localStorage` está corrupto?**
   `JSON.parse` lanza un error. Lo capturamos con `try/catch`, lo mostramos con `console.error` y
   empezamos con la lista vacía. La app no se rompe.
5. **¿Cómo sabe cada botón de borrar qué gasto tiene que borrar?**
   La arrow function del `click` se crea dentro de `createExpenseItem`, donde existe el `id` de ese gasto.
   La función lo "recuerda" (closure) y lo pasa a `removeExpense(id)`.
6. **¿Por qué no usas `innerHTML` para pintar la lista, si sí lo usas para vaciarla?**
   Con `innerHTML = ''` no hay datos del usuario, así que no hay riesgo. Para el nombre usamos `textContent`,
   que nunca interpreta HTML (evita XSS).
7. **¿Diferencia entre named y default export?**
   Mi módulo `expenses.js` usa **named exports** (`export function addExpense...`) porque exporta varias funciones,
   y se importan con llaves: `import { addExpense } from './expenses.js'`. Un **default export** es el valor
   principal de un módulo y se importa sin llaves, como hace la Persona A con `validateExpense`.
