# Resumen Persona A: proyecto, HTML y entrada de datos

## 1. Qué se ha hecho

La Persona A se encarga de la parte que ve y toca el usuario. Esto incluye la página (HTML y CSS), la
lectura de los datos del formulario y la validación antes de que el gasto llegue a la lista.
Cuando el gasto es válido, se pasa a las funciones de la Persona B (`addExpense` y `render`), que lo
guardan y lo pintan.

## 2. Archivos y funciones

| Archivo | Qué contiene |
|---|---|
| `index.html` | Estructura de la página: formulario, mensaje de error, lista y total. Usa los `id`/`name` del contrato. |
| `src/style.css` | Estilos: tarjeta centrada, formulario en rejilla, error en rojo, lista y total. Se adapta a móvil. |
| `src/validation.js` | `validateExpense(name, amount)` → `{ valid, error }` |
| `src/main.js` | Listener `submit` del formulario, que conecta la validación con `addExpense()` y `render()`. |

## 3. Explicación paso a paso (para contarla en voz alta)

### `validation.js`

1. La función recibe el nombre ya recortado y el importe ya convertido a número.
2. **Nombre**: si después de `trim()` queda una cadena vacía, devolvemos
   `{ valid: false, error: 'Escribe el nombre del gasto.' }`. Así rechazamos tanto `''` como `'   '`.
3. **Importe numérico**: con `Number.isFinite(amount)` comprobamos que es un número real.
   Si el usuario escribe texto, `Number('abc')` da `NaN`, y `Number.isFinite(NaN)` es `false`.
4. **Importe positivo**: si `amount <= 0` lo rechazamos. Así quedan fuera el `0` y los negativos.
   También queda fuera el campo vacío, porque `Number('')` vale `0`.
5. Si pasa todas las comprobaciones, devolvemos `{ valid: true, error: '' }`.

Cada regla termina con un `return` temprano. Así el código se lee de arriba abajo, sin `if` anidados.

### `main.js`

1. Importamos el CSS y las funciones de los otros módulos con `import`.
2. Guardamos en constantes las referencias al formulario, a los dos inputs (con `form.elements['expense-name']`)
   y al párrafo `#error`.
3. `showError` es una **arrow function** que escribe el mensaje con `textContent`, que es seguro y no interpreta HTML.
4. Escuchamos el evento `submit` del formulario:
   1. `event.preventDefault()` evita que el navegador recargue la página.
   2. Leemos los valores: `nameInput.value.trim()` y `Number(amountInput.value)`.
   3. Llamamos a `validateExpense` y sacamos `valid` y `error` con **destructuring**.
   4. Si no es válido, mostramos el error y salimos con `return`.
   5. Si es válido, borramos el error, llamamos a `addExpense(name, amount)` y a `render()`.
   6. `form.reset()` vacía los inputs y `nameInput.focus()` deja el cursor listo para el siguiente gasto.
5. Al final llamamos a `render()` una vez para el pintado inicial (lista vacía y total `0.00`).

### `index.html` y `style.css`

- El formulario tiene `novalidate` para que los errores los gestione nuestro JavaScript, no el navegador.
- `#error` tiene `role="alert"`, así que los lectores de pantalla leen el mensaje en cuanto aparece.
- En CSS usamos variables (`:root`), una rejilla (`grid`) para el formulario y una media query para móvil.
  Con `#expense-list:empty::before` mostramos "Todavía no hay gastos." cuando la lista está vacía.

## 4. Conceptos del Módulo 03 aplicados

| Concepto | Dónde |
|---|---|
| `const` / `let` | `main.js`: referencias al DOM y valores leídos |
| Arrow functions | `main.js`: `showError` y el callback del `submit` |
| Destructuring | `main.js`: `const { valid, error } = validateExpense(...)` |
| Módulos `import` / `export` | `validation.js` exporta y `main.js` importa de los tres módulos |
| DOM | `querySelector`, `form.elements`, `textContent`, `focus()`, `reset()` |
| Eventos | `addEventListener('submit', ...)` y `preventDefault()` |
| Conversión de tipos | `Number()`, `Number.isFinite()`, `trim()` |
| Objetos | El retorno `{ valid, error }` de la validación |

## 5. Decisiones tomadas y por qué

- **Validación en un módulo aparte**: es una función pura (no toca el DOM), así que se prueba fácilmente.
  También separa el "qué es válido" del "cómo se muestra".
- **`Number.isFinite` en vez de `isNaN`**: es más estricto, porque no convierte el valor y además rechaza `Infinity`.
- **`novalidate` en el formulario**: así todos los mensajes salen de `validateExpense` y son iguales en cualquier navegador.
- **`textContent` en vez de `innerHTML`**: el mensaje de error nunca se interpreta como HTML.
- **Reservar altura en `#error`**: la página no "salta" cuando aparece o desaparece el mensaje.

## 6. Cómo hacer la demo en vivo

1. `cd exercises/03`, `npm install` y `npm run dev`, y abrir http://localhost:5173.
2. Pulsar "Añadir" con todo vacío → aparece "Escribe el nombre del gasto.".
3. Escribir solo espacios en el nombre → mismo error.
4. Nombre "Café", importe vacío, `0` o `-3` → "Escribe un importe mayor que 0.".
5. Añadir Café 10, Pan 5.5 y Leche 4.5 → la lista muestra los tres en orden y el total es `20.00`.
6. Señalar que la página no se recarga y que el cursor vuelve al nombre tras cada gasto.
7. Opcional: abrir DevTools y enseñar `main.js` y `validation.js` en la pestaña Sources.

## 7. Posibles preguntas del profesor

1. **¿Por qué `preventDefault()`?**
   Por defecto, un `submit` envía el formulario y recarga la página. Perderíamos la lista, que está en memoria.
2. **¿Qué pasa si el importe está vacío?**
   `Number('')` devuelve `0`, y la regla `amount <= 0` lo rechaza. No hace falta un caso especial.
3. **¿Por qué no usar `required` y `min` del HTML?**
   El enunciado pide que lo controlemos con JavaScript. Además, así los mensajes son nuestros y coherentes.
   Por eso ponemos `novalidate`.
4. **¿Cómo se comunica tu parte con la de tu compañero?**
   Mediante un contrato: los `id`/`name` del HTML y las firmas `addExpense(name, amount)` y `render()`.
   Yo solo llamo a esas funciones, sin saber cómo guardan o pintan los datos.
5. **¿Por qué `Number.isFinite` y no `isNaN`?**
   `isNaN` convierte el valor antes de comprobarlo y deja pasar `Infinity`.
   `Number.isFinite` solo acepta números reales finitos.
