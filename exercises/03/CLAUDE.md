# Ejercicio 03 — Budget Tracker (JavaScript Fundamentals)

Este archivo es la especificación del ejercicio 03 para Claude Code. Lo usan las dos personas del equipo:
cada una clona el repo, abre Claude Code y dice **"soy la persona A"** o **"soy la persona B"**.
Claude debe seguir este documento al pie de la letra.

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
| `src/validation.js` (A) | `export function validateExpense(name, amount)` | `name: string` (ya con `trim()`), `amount: number` (ya con `Number()`) | `{ valid: boolean, error: string }`. `error` vale `''` si es válido |
| `src/expenses.js` (B) | `export function addExpense(name, amount)` | `name: string`, `amount: number` (ya validados) | `void` |
| `src/expenses.js` (B) | `export function getExpenses()` | ninguna | `Array<{ id: string \| number, name: string, amount: number }>`: una copia, en orden de inserción |
| `src/expenses.js` (B) | `export function getTotal()` | ninguna | `number`: suma de importes (`0` si no hay gastos) |
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
  - Estado en un array (`const expenses = []`).
  - `addExpense`: crear `{ id, name, amount }` con `id` de `crypto.randomUUID()` o de un contador, y hacer `push`.
  - `getTotal`: suma con `reduce`.
  - `getExpenses`: devolver una **copia** con spread (`[...expenses]`).
- **`src/render.js`**: `render()`:
  - Vaciar `#expense-list`.
  - Crear un `<li>` por gasto con `document.createElement` y `textContent`.
    **NUNCA usar `innerHTML` con datos del usuario** (evita XSS).
  - Escribir el total en `#total` con `toFixed(2)`.
- **Extras opcionales**:
  - Botón de borrar en cada gasto (`removeExpense(id)` con `filter`).
    Es una función nueva del contrato, así que hay que avisar al compañero.
  - Persistencia en `localStorage` con `JSON.stringify` / `JSON.parse`.
- **`README.md`**: versión final con descripción, cómo arrancarlo y el reparto.

---

## 5. Flujo de trabajo cuando el usuario diga "soy la persona A" o "soy la persona B"

1. **Entender**: leer este CLAUDE.md y el enunciado. Resumir al usuario en pocas líneas su parte
   (archivos, funciones, qué tiene que hacer) y **pedir confirmación** antes de empezar.
2. **Git**: aplicar la norma de la sección 3. Desde `main` actualizado (`git checkout main && git pull`),
   crear la rama `persona-a` o `persona-b` y trabajar siempre en ella, nunca en `main`.
3. **Alcance**: trabajar **SOLO en los archivos de su persona**. Si necesita algo del otro lado,
   respetar el contrato. Si hiciera falta cambiarlo, **parar y avisar al usuario**.
4. **Probar en aislamiento**: mientras la otra parte no esté hecha, probar la suya con datos de prueba
   en la consola del navegador o con un pequeño script, **sin dejar ese código en los archivos del compañero**.
   Por ejemplo:
   - A: `validateExpense('', 5)` en consola, o comprobar que `#error` se rellena.
   - B: llamar a `addExpense('Café', 2.5)` y `render()` desde la consola importando el módulo.
5. **Estilo de código**: usar los conceptos del Módulo 03, que son `const`/`let`, arrow functions,
   `map`/`filter`/`reduce`, destructuring, spread, DOM, eventos, `import`/`export` y JSON.
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

### Resumen general (cuando las dos partes estén mergeadas en `main`)

Quien termine el último:

1. `git checkout main && git pull` y crear la rama `ex03-resumen-general`.
2. Generar `docs/RESUMEN_GENERAL.md` con:
   - Visión global del proyecto.
   - Diagrama del flujo: usuario escribe → submit → validación → `addExpense` → `render` → total.
   - Cómo encajan las dos partes a través del contrato.
   - Guion de exposición repartido entre Persona A y Persona B: quién cuenta qué y en qué orden (unos 5-10 min).
3. Push de la rama y abrir un PR contra `main` (sin mergearlo).
