# Resumen Persona B: datos, cálculo y pintado

## 1. Qué se ha hecho

La Persona B se encarga de lo que pasa después de validar un gasto: guardarlo, calcular el total y
pintarlo en la página. La Persona A llama a `addExpense(name, amount)` y a `render()`, y mi parte se
encarga de todo lo demás. También he escrito la versión final del `README.md`.

## 2. Archivos y funciones

| Archivo | Función | Qué hace |
|---|---|---|
| `src/expenses.js` | `addExpense(name, amount)` | Crea `{ id, name, amount }` y lo añade al array |
| `src/expenses.js` | `getExpenses()` | Devuelve una **copia** del array de gastos |
| `src/expenses.js` | `getTotal()` | Suma los importes con `reduce` (`0` si no hay gastos) |
| `src/render.js` | `render()` | Vacía `#expense-list`, crea un `<li>` por gasto y escribe el total en `#total` |
| `src/render.js` | `createExpenseItem(expense)` | Función auxiliar (no exportada) que crea el `<li>` de un gasto |
| `README.md` | — | Descripción, cómo arrancarlo, estructura y reparto |

## 3. Explicación paso a paso (para contarla en voz alta)

### `expenses.js`: el estado

1. `const expenses = []` guarda los gastos. Es `const`, así que no se puede reasignar,
   pero sí podemos hacer `push`: `const` protege la referencia, no el contenido.
2. El array **no se exporta**. Desde fuera solo se puede usar a través de las tres funciones,
   así que nadie puede romper el estado por accidente.
3. **`addExpense`**: crea el objeto con `crypto.randomUUID()` como `id` y lo añade con `push`.
   Escribimos `{ id, name, amount }` en vez de `{ name: name, amount: amount }` (forma abreviada de objetos).
4. **`getExpenses`**: devuelve `[...expenses]`. El spread crea un array nuevo, así que quien lo reciba
   puede modificarlo sin tocar nuestro estado.
5. **`getTotal`**: `expenses.reduce((sum, { amount }) => sum + amount, 0)`.
   - `reduce` recorre el array acumulando un valor. Empieza en `0`, así que con la lista vacía devuelve `0`.
   - `{ amount }` en los parámetros es **destructuring**: sacamos solo el importe de cada gasto.

### `render.js`: el pintado

1. Al cargar el módulo guardamos las referencias a `#expense-list` y `#total` con `querySelector`.
2. `createExpenseItem` es una **arrow function** que recibe un gasto y devuelve un `<li>` con dos `<span>`:
   el nombre y el importe (`amount.toFixed(2)` + `€`). El CSS de la Persona A los coloca a izquierda y derecha.
3. **`render()`**:
   1. `list.replaceChildren()` vacía la lista. Así, cada vez que pintamos, empezamos de cero y no hay duplicados.
   2. `getExpenses().map(createExpenseItem)` transforma el array de gastos en un array de `<li>`.
      Es el mismo patrón que en las diapositivas (`map` de números a `<li>`), pero con nodos del DOM.
   3. `list.append(...items)` los añade todos de una vez (spread de argumentos).
   4. `total.textContent = getTotal().toFixed(2)` muestra el total con dos decimales (`20` → `"20.00"`).

### Seguridad: `textContent` y no `innerHTML`

El nombre lo escribe el usuario. Si usáramos `innerHTML`, un nombre como
`<img src=x onerror=alert(1)>` se interpretaría como HTML y ejecutaría código (**XSS**).
Con `createElement` + `textContent` el texto se muestra tal cual, sin interpretarlo nunca.

## 4. Conceptos del Módulo 03 aplicados

| Concepto | Dónde |
|---|---|
| `const` (referencia constante, contenido mutable) | `expenses.js`: `const expenses = []` + `push` |
| Arrow functions | `render.js`: `createExpenseItem`; `expenses.js`: callback de `reduce` |
| `map` | `render.js`: gastos → `<li>` |
| `reduce` | `expenses.js`: `getTotal()` |
| Spread (arrays y argumentos) | `getExpenses()`: `[...expenses]`; `render()`: `list.append(...items)` |
| Destructuring | `getTotal()`: `({ amount })`; `createExpenseItem`: `({ name, amount })` |
| Objetos literales (forma abreviada) | `addExpense`: `{ id, name, amount }` |
| Template literals | `render.js`: `` `${amount.toFixed(2)} €` `` |
| DOM | `querySelector`, `createElement`, `textContent`, `append`, `replaceChildren` |
| Módulos `import` / `export` | `expenses.js` exporta; `render.js` y `main.js` importan |

## 5. Decisiones tomadas y por qué

- **Estado privado en el módulo**: cada módulo ES6 tiene su propio ámbito. Si no exportamos el array,
  la única forma de cambiarlo es `addExpense`. Así el estado siempre es coherente.
- **`getExpenses` devuelve una copia**: siguiendo la idea de **inmutabilidad** del tema
  (lo que React espera del estado). Es una copia superficial, pero suficiente: nadie modifica los objetos.
- **`crypto.randomUUID()` para el `id`**: no hace falta llevar un contador, y los ids no se repiten.
  Sirve de clave por si más adelante añadimos borrar gastos.
- **`render()` repinta toda la lista**: con pocos gastos es lo más sencillo y evita errores de
  sincronización. Es la misma idea que React: describir cómo debe verse la página según el estado.
- **`replaceChildren()` para vaciar**: es más claro que `innerHTML = ''` y no usa `innerHTML`.
- **Separar datos (`expenses.js`) y pintado (`render.js`)**: `expenses.js` no toca el DOM, así que
  se puede probar en Node. De hecho lo probamos así:
  `addExpense('Café', 10)`, `addExpense('Pan', 5.5)`, `addExpense('Leche', 4.5)` → `getTotal()` = `20`.

## 6. Cómo hacer la demo en vivo

1. `cd exercises/03`, `npm install` y `npm run dev`, y abrir http://localhost:5173.
2. Al cargar: la lista dice "Todavía no hay gastos." y el total es `0.00` (primer `render()`).
3. Añadir Café 10, Pan 5.5 y Leche 4.5 → aparecen en orden, con su importe a la derecha, y el total es `20.00`.
4. Añadir un gasto con nombre `<b>hola</b>` → se ve el texto literal, no en negrita. Explicar `textContent` y XSS.
5. Abrir DevTools → Elements y enseñar los `<li>` creados por `render()`.
6. Opcional, en la consola del navegador:
   ```js
   const { getExpenses, getTotal } = await import('/src/expenses.js')
   getExpenses()   // array con los gastos
   getTotal()      // 20
   ```

## 7. Posibles preguntas del profesor

1. **¿Por qué `getExpenses` devuelve una copia y no el array directamente?**
   Si devolviéramos el array original, cualquiera podría hacer `push` o `sort` sobre él y cambiar el estado
   sin pasar por `addExpense`. Con `[...expenses]` el estado solo cambia por nuestras funciones.
2. **¿Qué pasa con `getTotal()` si no hay gastos?**
   Devuelve `0`, porque `reduce` empieza con el valor inicial `0`. Sin ese valor inicial,
   `reduce` sobre un array vacío lanzaría un `TypeError`.
3. **¿Por qué no usas `innerHTML` para pintar la lista?**
   Porque el nombre lo escribe el usuario. Con `innerHTML` se interpretaría como HTML y podría ejecutar
   código (XSS). `textContent` siempre lo trata como texto.
4. **Si `expenses` es `const`, ¿cómo puedes hacer `push`?**
   `const` impide reasignar la variable (`expenses = [...]` daría error), pero no impide cambiar el
   contenido del array. Como en la diapositiva: cambias los muebles, no la dirección de la casa.
5. **¿Por qué `render()` borra y vuelve a pintar toda la lista en vez de añadir solo el último `<li>`?**
   Porque así la pantalla siempre refleja exactamente el estado, sea cual sea el cambio
   (añadir, y en el futuro borrar). Es el enfoque declarativo: "a partir de los datos, así debe verse".
