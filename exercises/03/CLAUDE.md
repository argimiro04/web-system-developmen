# Ejercicio 03 — Budget Tracker (JavaScript Fundamentals)

Este archivo es la especificación del ejercicio 03 para Claude Code. Lo usan las dos personas del equipo:
cada una clona el repo, abre Claude Code y dice **"soy la persona A"** o **"soy la persona B"**.
Claude debe seguir este documento al pie de la letra.

> **Estado actual**: la Fase 1 (versión básica) ya está hecha y mergeada en `main`.
> Ahora toca la **Fase 2: alineación con el temario del Módulo 03** (sección 8).
> Si el usuario dice "soy la persona A/B", Claude hace la Fase 2 de esa persona.

---

## 1. Contexto

### Enunciado (Módulo 03)

> **"JavaScript Fundamentals: Budget Tracker"**. Create a simple budgeting page using vanilla JavaScript. Your page must:
>
> - Include an input for entering an expense name with `name="expense-name"`
> - Include an input for entering the amount with `name="expense-amount"`
> - Show a button to add the expense to a list
> - Show the total amount spent, calculated as new items are added, and display the total in an element with `id="total"`
> - Prevent adding empty or invalid values. name must not be empty, amount must be a positive number.
> - Dynamically render the list of expenses using JavaScript and calculate the total.
> - Spin up a Vite project to build your application. Do not use frameworks.
> - Add this exercise to your repository under: `/exercises/03/`

### Restricciones

- **NO se usan frameworks ni librerías** (nada de React, Vue, jQuery, Lodash, etc.).
- Vite es **solo la herramienta de build** (`npm run dev`, `npm run build`).
- JavaScript **vanilla** con **módulos ES6** (`import` / `export`).
- No añadir dependencias nuevas al `package.json`.

### Estructura

```
exercises/03/
├── CLAUDE.md             → este archivo
├── README.md             → Persona B (versión final)
├── index.html            → contrato común (maquetación: Persona A)
├── docs/                 → resúmenes para la exposición
└── src/
    ├── main.js           → Persona A
    ├── validation.js     → Persona A
    ├── style.css         → Persona A
    ├── expenses.js       → Persona B
    └── render.js         → Persona B
```

---

## 2. Contrato común

**No se puede cambiar sin avisar antes al compañero.** Si Claude cree que hay que cambiar algo de aquí,
debe PARAR y decírselo al usuario. No puede cambiarlo por su cuenta.

### Elementos del HTML (`index.html`)

| Selector | Elemento | Uso |
|---|---|---|
| `#expense-form` | `<form>` | Formulario; se escucha su evento `submit` (A) |
| `[name="expense-name"]` | `<input type="text">` | Nombre del gasto (A lo lee) |
| `[name="expense-amount"]` | `<input type="number" step="0.01">` | Importe del gasto (A lo lee) |
| `button[type="submit"]` | `<button>` | Botón "Añadir" |
| `#error` | `<p role="alert">` | Mensaje de error de validación (A lo escribe) |
| `#expense-list` | `<ul>` | Lista de gastos (B la pinta) |
| `#total` | `<span>` | Total gastado con 2 decimales (B lo pinta) |

### Firmas de las funciones

| Archivo | Firma | Entrada | Salida |
|---|---|---|---|
| `src/validation.js` (A) | `export default function validateExpense(name, amount)` (**default export** desde la Fase 2) | `name: string` (ya con `trim()`), `amount: number` (ya con `Number()`) | `{ valid: boolean, error: string }`. `error` vale `''` si es válido |
| `src/expenses.js` (B) | `export function addExpense(name, amount)` | `name: string`, `amount: number` (ya validados) | `void` |
| `src/expenses.js` (B) | `export function getExpenses()` | ninguna | `Array<{ id: number, name: string, amount: number }>`: una copia, en orden de inserción |
| `src/expenses.js` (B) | `export function getTotal()` | ninguna | `number`: suma de importes (`0` si no hay gastos) |
| `src/expenses.js` (B) | `export function removeExpense(id)` (Fase 2) | `id: number` | `void`: elimina el gasto con ese `id` |
| `src/render.js` (B) | `export function render()` | ninguna (lee de `getExpenses()` y `getTotal()`) | `void`: pinta `#expense-list` y `#total` |

### Flujo

```
usuario escribe → submit (#expense-form) → main.js lee y limpia valores
  → validateExpense(name, amount)
      ├─ no válido → mensaje en #error
      └─ válido    → addExpense(name, amount) → render() → lista + #total actualizados
```

---

## 3. Norma de Git (OBLIGATORIA, por encima de cualquier otra instrucción)

1. **NUNCA trabajar, hacer commit ni push directamente en `main`.**
   Antes de tocar ningún archivo, comprobar la rama actual:
   ```bash
   git branch --show-current
   ```
   Si es `main`, primero `git pull` y después crear una rama nueva (`git checkout -b <rama>`).
2. **Nombres de rama**:
   - `persona-a`: trabajo de la Persona A.
   - `persona-b`: trabajo de la Persona B.
   - `ex03-<descripcion-corta>` para cualquier otro cambio (por ejemplo, `ex03-resumen-general`).
3. **Al terminar**:
   - `git push -u origin <rama>`
   - Abrir un Pull Request contra `main`, con `gh pr create --base main` si `gh` está disponible.
     Si no lo está, darle al usuario el enlace para crearlo en GitHub.
   - El PR lleva un **título claro** y una **descripción** con lo que se ha hecho y cómo probarlo.
4. **NUNCA** hacer merge del PR, ni `git merge` en `main`, ni `git push --force`.
   **El merge lo hace el responsable del repo.**

---

## 4. Reparto

### Persona A: proyecto, HTML y entrada de datos

Archivos: `index.html`, `src/style.css`, `src/validation.js`, `src/main.js`.

- **`index.html`**: solo estilo y maquetación (textos, etiquetas, contenedores). **No cambiar los `id` ni los `name`** del contrato.
- **`src/style.css`**: estilos de la página (formulario, lista, total, mensaje de error).
- **`src/validation.js`**: `validateExpense(name, amount)`:
  - Rechazar nombre vacío o formado solo por espacios.
  - Rechazar importe no numérico, `NaN`, `0` o negativo.
  - Devolver `{ valid: false, error: '<mensaje claro>' }` o `{ valid: true, error: '' }`.
- **`src/main.js`**: listener `submit` del `#expense-form`:
  1. `event.preventDefault()` (la página no se recarga).
  2. Leer los valores de los inputs, aplicar `trim()` al nombre y convertir el importe con `Number`.
     Ojo: `Number('')` devuelve `0`, que la validación debe rechazar.
  3. Llamar a `validateExpense`.
  4. Si no es válido, mostrar el error en `#error`.
     Si es válido, limpiar `#error`, llamar a `addExpense()` y después a `render()`.
  5. Limpiar los inputs y devolver el foco al input del nombre.

### Persona B: datos, cálculo y pintado

Archivos: `src/expenses.js`, `src/render.js`, `README.md` (versión final).

- **`src/expenses.js`**:
  - Estado en un array (`let expenses`), actualizado de forma **inmutable** con `concat` (ver sección 8).
  - `addExpense`: crear `{ id, name, amount }` con `id` numérico de un contador.
  - `getTotal`: suma con `reduce`.
  - `getExpenses`: devolver una **copia** con spread (`[...expenses]`).
- **`src/render.js`**: `render()`:
  - Vaciar `#expense-list`.
  - Crear un `<li>` por gasto con `document.createElement` y `textContent`.
    **NUNCA usar `innerHTML` con datos del usuario** (evita XSS).
  - Escribir el total en `#total` con `toFixed(2)`.
- **Ya no son opcionales** (Fase 2, sección 8): botón de borrar con `filter` y persistencia con `JSON.stringify` / `JSON.parse`.
- **`README.md`**: versión final con descripción, cómo arrancarlo y el reparto.

---

## 5. Flujo de trabajo cuando el usuario diga "soy la persona A" o "soy la persona B"

1. **Entender**: leer este CLAUDE.md y el enunciado. Si `docs/RESUMEN_PERSONA_X.md` ya existe en `main`,
   la Fase 1 de esa persona está hecha: trabajar en la **Fase 2 (sección 8)**. Resumir al usuario en pocas líneas su parte
   (archivos, funciones, qué tiene que hacer) y **pedir confirmación** antes de empezar.
2. **Git**: aplicar la norma de la sección 3. Desde `main` actualizado (`git checkout main && git pull`),
   crear la rama `persona-a` o `persona-b` (Fase 2: `persona-a-temario` o `persona-b-temario`)
   y trabajar siempre en ella, nunca en `main`.
3. **Alcance**: trabajar **SOLO en los archivos de su persona**. Si necesita algo del otro lado,
   respetar el contrato. Si hiciera falta cambiarlo, **parar y avisar al usuario**.
4. **Probar en aislamiento**: mientras la otra parte no esté hecha, probar la suya con datos de prueba
   en la consola del navegador o con un pequeño script, **sin dejar ese código en los archivos del compañero**.
   Por ejemplo:
   - A: `validateExpense('', 5)` en consola, o comprobar que `#error` se rellena.
   - B: llamar a `addExpense('Café', 2.5)` y `render()` desde la consola importando el módulo.
5. **Estilo de código**: seguir las reglas de alineación con el temario (sección 8.1).
   Escribir código **comentado y legible**, porque hay que exponerlo en clase.
6. **Verificar**: `npm run build` sin errores y la checklist de la sección 6.
7. **Entregar**: commits pequeños con mensajes claros en su rama, `git push -u origin <rama>` y abrir
   un Pull Request contra `main`. **No hacer el merge**: avisar al usuario de que el PR está listo
   para que lo revise y lo mergee el responsable del repo.
8. **Resumen**: al terminar, generar el resumen de la sección 7 en la misma rama, incluido en el PR.

---

## 6. Checklist de pruebas

- [ ] Nombre vacío → rechazado (mensaje en `#error`).
- [ ] Nombre solo con espacios → rechazado.
- [ ] Importe vacío → rechazado.
- [ ] Importe con texto → rechazado.
- [ ] Importe `0` → rechazado.
- [ ] Importe negativo → rechazado.
- [ ] Añadir 3 gastos (10, 5.5, 4.5) → `#total` muestra `20.00`.
- [ ] La lista muestra todos los gastos en el orden en que se añadieron.
- [ ] La página no se recarga al enviar el formulario.
- [ ] Borrar un gasto lo quita de la lista y actualiza `#total` (Fase 2).
- [ ] Al recargar la página, los gastos siguen ahí (Fase 2, JSON + `localStorage`).
- [ ] Con un valor corrupto en `localStorage` la app no se rompe y arranca con la lista vacía (Fase 2).
- [ ] En la consola aparece un `console.warn` al rechazar un gasto (Fase 2).
- [ ] `npm run build` funciona sin errores.

---

## 7. Resúmenes para la exposición

### Resumen individual (al acabar cada persona su parte)

En la misma rama de la persona e incluido en su PR, crear `docs/RESUMEN_PERSONA_A.md` o
`docs/RESUMEN_PERSONA_B.md` con:

1. Qué se ha hecho.
2. Archivos y funciones de los que es responsable.
3. Explicación paso a paso del código, pensada para contarla en voz alta.
4. Conceptos del Módulo 03 que se aplican y dónde (archivo y función).
5. Decisiones tomadas y por qué.
6. Cómo hacer la demo en vivo.
7. 4-5 posibles preguntas del profesor, con su respuesta.

En la Fase 2, **actualizar** ese mismo resumen (no crear otro): añadir los cambios, el porqué de cada uno
según el temario y nuevas preguntas posibles (por ejemplo: "¿por qué `concat` y no `push`?",
"¿diferencia entre named y default export?", "¿qué hace `JSON.stringify`?").

### Resumen general (cuando las Fases 2 de las dos partes estén mergeadas en `main`)

Quien termine el último:

1. `git checkout main && git pull` y crear la rama `ex03-resumen-general`.
2. Generar `docs/RESUMEN_GENERAL.md` con:
   - Visión global del proyecto.
   - Diagrama del flujo: usuario escribe → submit → validación → `addExpense` → `render` → total.
   - Cómo encajan las dos partes a través del contrato.
   - Guion de exposición repartido entre Persona A y Persona B: quién cuenta qué y en qué orden (unos 5-10 min).
3. Push de la rama y abrir un PR contra `main` (sin mergearlo).

---

## 8. Fase 2: alineación con el temario del Módulo 03

Tras revisar la Fase 1 contra las diapositivas del Módulo 03, el ejercicio cumple el enunciado,
pero **no usa varios conceptos del temario** (JSON, `filter`, `concat`/inmutabilidad, `export default`,
Console API) y **usa APIs que no se han visto en clase** (`crypto.randomUUID()`, `replaceChildren()`,
`form.elements`, `form.reset()`). Hay que exponerlo, así que el código debe reflejar lo que se ha dado.

### 8.1 Reglas de alineación (para todo el código del ejercicio)

1. **Usar lo que está en el temario**: `const`/`let` (nunca `var`), arrow functions, template literals,
   objetos literales y shorthand, destructuring, spread, `map`/`filter`/`reduce`/`forEach`/`concat`,
   `getElementById`/`querySelector` (incluido el selector de atributo `[name="..."]`),
   `createElement`/`textContent`/`appendChild`, `addEventListener` (`submit`, `click`),
   módulos ES6 con **named y default exports**, `JSON.stringify`/`JSON.parse` y Console API
   (`console.log`/`warn`/`error`).
2. **Evitar APIs que no salen en las diapositivas** si hay un equivalente del temario
   (tabla de sustituciones abajo). Si de verdad hace falta una que no está, dejar un comentario
   explicando qué hace y por qué se usa, y mencionarla en el resumen.
3. **No usar** `class`, `fetch` ni librerías: no aportan nada en este ejercicio.
4. **No usar `innerHTML` con datos del usuario.** Solo se permite `innerHTML = ''` para vaciar un contenedor.

| En la Fase 1 | Sustituir por (temario) | Quién |
|---|---|---|
| `form.elements['expense-name']` | `document.querySelector('[name="expense-name"]')` | A |
| `form.reset()` | `input.value = ''` en cada input | A |
| `export function validateExpense` + `import { validateExpense }` | `export default` + `import validateExpense from './validation.js'` | A |
| `crypto.randomUUID()` | contador numérico (`let nextId`) | B |
| `expenses.push(expense)` | `expenses = expenses.concat(expense)` (array inmutable) | B |
| `list.replaceChildren()` | `list.innerHTML = ''` (solo para vaciar) | B |
| `list.append(...items)` | `forEach` + `appendChild` (patrón de la diapositiva del DOM) | B |

### 8.2 Persona A — Fase 2 (rama `persona-a-temario`)

Archivos: `src/validation.js`, `src/main.js` (y `index.html`/`style.css` si hace falta estilo para el botón de borrar).

1. **Default export**: `validation.js` exporta `validateExpense` con `export default`. En `main.js`,
   importarlo **sin llaves** y mantener `addExpense` y `render` como named imports (con llaves).
   En el resumen, explicar la diferencia (diapositivas "Named Exports", "Default Export" y "Why Use Braces").
2. **Selectores del temario**: obtener los inputs con `querySelector('[name="expense-name"]')`
   y `querySelector('[name="expense-amount"]')` en lugar de `form.elements`.
3. **Limpiar inputs** con `.value = ''` en lugar de `form.reset()`.
4. **Console API**: cuando la validación falle, además de mostrar el error en `#error`,
   hacer `console.warn(...)` con el motivo y los valores rechazados (por ejemplo, `{ name, amount }`).
5. `validation.js`: mantener `Number.isFinite`, pero dejar un comentario que explique por qué
   (descarta `NaN` e `Infinity`, cosa que `amount > 0` por sí solo no garantiza).
6. Estilos (`style.css`) para el botón de borrar que añade B: clase `.delete-btn`.
   Esta clase es parte del contrato.
7. Actualizar `docs/RESUMEN_PERSONA_A.md` y abrir el PR (sin mergear).

### 8.3 Persona B — Fase 2 (rama `persona-b-temario`)

Archivos: `src/expenses.js`, `src/render.js`, `README.md`.

1. **Inmutabilidad** (diapositiva "Immutable Arrays"): `let expenses` y añadir con
   `expenses = expenses.concat(expense)` en lugar de `push`. Explicar en el resumen por qué
   (no se modifica el array original; es la base de cómo se actualiza el estado en React, el siguiente módulo).
2. **IDs con contador**: `let nextId`, que al arrancar continúa desde el `id` mayor de los gastos
   cargados (por ejemplo, con `reduce`), en lugar de `crypto.randomUUID()`.
3. **`removeExpense(id)`** con `filter` (nueva función del contrato, en la tabla de la sección 2).
4. **Persistencia con JSON**:
   - `saveExpenses()` (interna, no exportada): `localStorage.setItem('budget-tracker-expenses', JSON.stringify(expenses))`,
     llamada después de añadir o borrar.
   - Carga inicial: `JSON.parse(localStorage.getItem('budget-tracker-expenses'))` dentro de `try/catch`.
     Si no hay nada o el JSON está corrupto, empezar con `[]`; en caso de error, `console.error`.
5. **`render.js`**:
   - Vaciar con `list.innerHTML = ''` y crear los `<li>` con `forEach` + `createElement` + `appendChild`.
   - En cada `<li>`, un `<button class="delete-btn" type="button">` con `addEventListener('click', ...)`
     que llama a `removeExpense(id)` y luego a `render()`.
   - Mantener `textContent` para los datos del usuario y `toFixed(2)` para importes y total.
6. Actualizar `README.md` y `docs/RESUMEN_PERSONA_B.md`, y abrir el PR (sin mergear).

### 8.4 Independencia entre A y B

Los cambios de A y B **no se pisan**: A solo toca `validation.js`/`main.js`/estilos, y B solo `expenses.js`/`render.js`.
`main.js` no necesita `removeExpense` (lo usa `render.js`). Se pueden hacer en paralelo y mergear en cualquier orden.

### 8.5 Mapa temario → código (para el resumen general y la exposición)

| Diapositiva del Módulo 03 | Dónde se usa |
|---|---|
| Variables (`const`/`let`) | todos los archivos; `let expenses` y `let nextId` en `expenses.js` |
| Arrays: copia con spread | `getExpenses()` |
| Immutable arrays (`concat`) | `addExpense()` |
| Destructuring | `main.js` (`{ valid, error }`), `getTotal()` (`{ amount }`) |
| `map` / `filter` / `reduce` / `forEach` | `render()` / `removeExpense()` / `getTotal()` y `nextId` / `render()` |
| Arrow functions | listeners y callbacks |
| Objetos literales (shorthand) | `{ id, name, amount }` |
| DOM: selección | `querySelector` con id y con atributo |
| DOM: manipulación | `createElement`, `textContent`, `appendChild` |
| Event handling | `submit` (A), `click` del botón de borrar (B) |
| Módulos ES6: named + default | `main.js` mezcla los dos tipos de import |
| JSON | `saveExpenses()` y carga inicial |
| Console API | `console.warn` (A), `console.error` (B) |
| npm / `package.json` / Vite | `npm install`, `npm run dev`, `npm run build` |
