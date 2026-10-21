# Ejercicio 03 – Budget Tracker

Página de control de gastos hecha con JavaScript vanilla (módulos ES6) y [Vite](https://vite.dev/), sin frameworks.
Permite añadir gastos con nombre e importe, los muestra en una lista y calcula el total.

## Funcionalidades

- Formulario con nombre (`name="expense-name"`) e importe (`name="expense-amount"`) y un botón **Añadir**.
- Validación: el nombre no puede estar vacío y el importe tiene que ser un número mayor que 0.
  Si algo falla, se muestra un mensaje en `#error`.
- La lista de gastos se pinta dinámicamente con JavaScript, en el orden en que se añaden.
- Cada gasto tiene un botón **Borrar** para quitarlo de la lista.
- El total se recalcula con cada cambio y se muestra con 2 decimales en `#total`.
- Los gastos se guardan en `localStorage` como JSON, así que siguen ahí al recargar la página.
  Si lo guardado está corrupto, la app arranca con la lista vacía y lo indica en la consola.
- La página no se recarga al enviar el formulario.

## Cómo arrancarlo

Requisitos: [Node.js](https://nodejs.org/) y npm.

```bash
cd exercises/03
npm install      # instala las dependencias (Vite)
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # genera la versión de producción en dist/
npm run preview  # sirve la versión de producción para probarla
```

## Estructura

```
exercises/03/
├── index.html          → estructura de la página (formulario, error, lista y total)
├── docs/               → resúmenes para la exposición
└── src/
    ├── main.js         → punto de entrada: escucha el submit y conecta los módulos
    ├── validation.js   → validateExpense(name, amount)
    ├── expenses.js     → estado: addExpense, removeExpense, getExpenses, getTotal (+ localStorage)
    ├── render.js       → render(): pinta la lista (con botón de borrar) y el total
    └── style.css       → estilos
```

## Cómo funciona

```
usuario escribe → submit (#expense-form) → main.js lee y limpia valores
  → validateExpense(name, amount)
      ├─ no válido → mensaje en #error
      └─ válido    → addExpense(name, amount) → render() → lista + #total actualizados

clic en "Borrar" → removeExpense(id) → render()
addExpense / removeExpense → guardan la lista en localStorage (JSON.stringify)
al cargar la página → expenses.js lee localStorage (JSON.parse) → render() inicial
```

## Reparto

| Persona | Responsabilidad | Archivos |
|---|---|---|
| A | Proyecto, HTML y entrada de datos | `index.html`, `src/style.css`, `src/validation.js`, `src/main.js` |
| B | Datos, cálculo y pintado | `src/expenses.js`, `src/render.js`, `README.md` |

Las especificaciones completas (contrato, norma de Git y checklist) están en [CLAUDE.md](CLAUDE.md).
Los resúmenes de cada parte están en [docs/](docs/).
