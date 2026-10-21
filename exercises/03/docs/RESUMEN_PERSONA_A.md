# Resumen Persona A: proyecto, HTML y entrada de datos

## 1. Qué se ha hecho

La Persona A se encarga de la parte que ve y toca el usuario. Esto incluye la página (HTML y CSS), la
lectura de los datos del formulario y la validación antes de que el gasto llegue a la lista.
Cuando el gasto es válido, se pasa a las funciones de la Persona B (`addExpense` y `render`), que lo
guardan y lo pintan.

En la **Fase 2** se ha alineado el código con el temario del Módulo 03 (ver la sección 8):

- `validateExpense` pasa a ser un **default export**.
- Los inputs se seleccionan con `querySelector` y un **selector de atributo**.
- Los inputs se limpian con `.value = ''`.
- Cada rechazo se registra con **`console.warn`**.
- Se han añadido los estilos del **botón de borrar** (`.delete-btn`).

## 2. Archivos y funciones

| Archivo | Qué contiene |
|---|---|
| `index.html` | Estructura de la página: formulario, mensaje de error, lista y total. Usa los `id`/`name` del contrato. |
| `src/style.css` | Estilos: tarjeta centrada, formulario en rejilla, error en rojo, lista, botón de borrar (`.delete-btn`) y total. Se adapta a móvil. |
| `src/validation.js` | `export default function validateExpense(name, amount)` → `{ valid, error }` |
| `src/main.js` | Listener `submit` del formulario, que conecta la validación con `addExpense()` y `render()`. |

## 3. Explicación paso a paso (para contarla en voz alta)

### `validation.js`

1. El módulo exporta una sola función, así que usa **`export default`**.
2. La función recibe el nombre ya recortado y el importe ya convertido a número.
3. **Nombre**: si después de `trim()` queda una cadena vacía, devolvemos
   `{ valid: false, error: 'Escribe el nombre del gasto.' }`. Así rechazamos tanto `''` como `'   '`.
4. **Importe numérico**: `Number.isFinite(amount)` solo es `true` para números normales.
   Descarta `NaN` (por ejemplo, `Number('abc')`) e `Infinity` (por ejemplo, `Number('1e999')`).
   La comprobación `amount > 0` no basta, porque `Infinity > 0` es `true`.
5. **Importe positivo**: si `amount <= 0` lo rechazamos. Así quedan fuera el `0` y los negativos.
   También queda fuera el campo vacío, porque `Number('')` vale `0`.
6. Si pasa todas las comprobaciones, devolvemos `{ valid: true, error: '' }`.

Cada regla termina con un `return` temprano. Así el código se lee de arriba abajo, sin `if` anidados.

### `main.js`

1. Importamos el CSS y las funciones de los otros módulos:
   - `import validateExpense from './validation.js'` es un **default import**, sin llaves.
   - `import { addExpense } from './expenses.js'` y `import { render } from './render.js'` son
     **named imports**, con llaves.
2. Guardamos en constantes las referencias al DOM:
   - el formulario, con `querySelector('#expense-form')`;
   - los inputs, con el **selector de atributo** `querySelector('[name="expense-name"]')` y `querySelector('[name="expense-amount"]')`;
   - el párrafo `#error`.
3. `showError` es una **arrow function** que escribe el mensaje con `textContent`, que es seguro y no interpreta HTML.
4. Escuchamos el evento `submit` del formulario:
   1. `event.preventDefault()` evita que el navegador recargue la página.
   2. Leemos los valores: `nameInput.value.trim()` y `Number(amountInput.value)`.
   3. Llamamos a `validateExpense` y sacamos `valid` y `error` con **destructuring**.
   4. Si no es válido:
      - mostramos el error en `#error`;
      - lo registramos con `console.warn(\`Gasto rechazado: ${error}\`, { name, amount })`, que usa un template literal y un objeto con shorthand;
      - salimos con `return`.
   5. Si es válido, borramos el error, llamamos a `addExpense(name, amount)` y a `render()`.
   6. Vaciamos los inputs con `nameInput.value = ''` y `amountInput.value = ''`.
      Después `nameInput.focus()` deja el cursor listo para el siguiente gasto.
5. Al final llamamos a `render()` una vez para el pintado inicial (lista y total).

### `index.html` y `style.css`

- El formulario tiene `novalidate` para que los errores los gestione nuestro JavaScript, no el navegador.
- `#error` tiene `role="alert"`, así que los lectores de pantalla leen el mensaje en cuanto aparece.
- En CSS usamos variables (`:root`), una rejilla (`grid`) para el formulario y una media query para móvil.
  Con `#expense-list:empty::before` mostramos "Todavía no hay gastos." cuando la lista está vacía.
- **`.delete-btn`** (Fase 2) es el botón que crea `render.js` en cada `<li>`. Es un botón pequeño con borde
  rojo que se rellena al pasar el ratón. El nombre del gasto ocupa el hueco libre
  (`li > :first-child { flex: 1 }`), así que el importe y el botón quedan alineados a la derecha.
  La clase es parte del contrato con la Persona B.

## 4. Conceptos del Módulo 03 aplicados

| Concepto | Dónde |
|---|---|
| `const` / `let` | `main.js`: referencias al DOM y valores leídos |
| Arrow functions | `main.js`: `showError` y el callback del `submit` |
| Template literals | `main.js`: mensaje del `console.warn` |
| Objetos literales (shorthand) | `main.js`: `{ name, amount }` en el `console.warn`; `validation.js`: `{ valid, error }` |
| Destructuring | `main.js`: `const { valid, error } = validateExpense(...)` |
| Módulos ES6: **default export** | `validation.js`: `export default function validateExpense` |
| Módulos ES6: named + default import | `main.js` mezcla los dos tipos |
| DOM: selección | `querySelector` con id (`#expense-form`, `#error`) y con atributo (`[name="..."]`) |
| DOM: manipulación | `textContent`, `.value`, `focus()` |
| Event handling | `addEventListener('submit', ...)` y `preventDefault()` |
| Console API | `main.js`: `console.warn` al rechazar un gasto |
| Conversión de tipos | `Number()`, `Number.isFinite()`, `trim()` |

## 5. Decisiones tomadas y por qué

- **Validación en un módulo aparte**: es una función pura (no toca el DOM), así que se prueba fácilmente.
  También separa el "qué es válido" del "cómo se muestra".
- **Default export en `validation.js`** (Fase 2): el módulo solo exporta una cosa, que es el caso de uso
  del default export según el temario. Así `main.js` muestra los dos tipos de import juntos.
- **`querySelector('[name="..."]')` en vez de `form.elements`** (Fase 2): el selector de atributo sale en
  las diapositivas del DOM y `form.elements` no. Además usa la misma función que el resto de selecciones.
- **`.value = ''` en vez de `form.reset()`** (Fase 2): es lo que se ha visto en clase y deja claro qué campos se vacían.
- **`console.warn` al rechazar** (Fase 2): la Console API distingue niveles (`log`, `warn` y `error`).
  Un dato rechazado no es un fallo del programa, así que corresponde un aviso y no un error.
- **`Number.isFinite` en vez de `isNaN`**: es más estricto, porque no convierte el valor y además rechaza `Infinity`.
  Se mantiene en la Fase 2 con un comentario que lo explica.
- **`novalidate` en el formulario**: así todos los mensajes salen de `validateExpense` y son iguales en cualquier navegador.
- **`textContent` en vez de `innerHTML`**: el mensaje de error nunca se interpreta como HTML.
- **Reservar altura en `#error`**: la página no "salta" cuando aparece o desaparece el mensaje.

## 6. Cómo hacer la demo en vivo

1. `cd exercises/03`, `npm install` y `npm run dev`, y abrir http://localhost:5173.
   Abrir también DevTools en la pestaña **Console**.
2. Pulsar "Añadir" con todo vacío → aparece "Escribe el nombre del gasto." y en la consola sale un aviso
   amarillo, `Gasto rechazado: ...`, con `{ name, amount }`.
3. Escribir solo espacios en el nombre → mismo error.
4. Nombre "Café", importe vacío, `0` o `-3` → "Escribe un importe mayor que 0.".
5. Añadir Café 10, Pan 5.5 y Leche 4.5 → la lista muestra los tres en orden y el total es `20.00`.
6. Señalar que la página no se recarga, que los inputs se vacían y que el cursor vuelve al nombre.
7. Con la Fase 2 de la Persona B mergeada: pulsar "Borrar" en un gasto para enseñar el estilo de `.delete-btn`.
8. Opcional: enseñar en la pestaña Sources los dos tipos de import al principio de `main.js`.

## 7. Posibles preguntas del profesor

1. **¿Por qué `preventDefault()`?**
   Por defecto, un `submit` envía el formulario y recarga la página. Perderíamos lo que hay en pantalla.
2. **¿Qué pasa si el importe está vacío?**
   `Number('')` devuelve `0`, y la regla `amount <= 0` lo rechaza. No hace falta un caso especial.
3. **¿Por qué no usar `required` y `min` del HTML?**
   El enunciado pide que lo controlemos con JavaScript. Además, así los mensajes son nuestros y coherentes.
   Por eso ponemos `novalidate`.
4. **¿Cómo se comunica tu parte con la de tu compañero?**
   Mediante un contrato:
   - los `id`/`name` del HTML;
   - las firmas `addExpense(name, amount)` y `render()`;
   - la clase `.delete-btn`.

   Yo solo llamo a esas funciones, sin saber cómo guardan o pintan los datos.
5. **¿Por qué `Number.isFinite` y no `isNaN` o solo `amount > 0`?**
   `isNaN` convierte el valor antes de comprobarlo y deja pasar `Infinity`.
   `amount > 0` también deja pasar `Infinity`. `Number.isFinite` solo acepta números reales finitos.
6. **¿Qué diferencia hay entre un named export y un default export?** (Fase 2)
   - Un módulo puede tener **muchos named exports**. Se importan **con llaves** y con el mismo nombre:
     `import { addExpense } from './expenses.js'`.
   - Solo puede tener **un default export**. Se importa **sin llaves** y con el nombre que queramos:
     `import validateExpense from './validation.js'`.
   - Las llaves indican "saca esta exportación concreta por su nombre".
7. **¿Por qué `querySelector('[name="expense-name"]')`?** (Fase 2)
   El enunciado identifica los inputs por su atributo `name`, no por un `id`. El selector de atributo
   `[name="..."]` los encuentra con la misma sintaxis que en CSS.
8. **¿Para qué sirve `console.warn` si el error ya sale en pantalla?** (Fase 2)
   El mensaje en pantalla es para el usuario. El `console.warn` es para el desarrollador, porque deja
   registrado qué valores se rechazaron y por qué. Se ve en amarillo y se puede filtrar por nivel en DevTools.
