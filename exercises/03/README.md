# Ejercicio 03 – Budget Tracker

Página de control de gastos hecha con JavaScript vanilla (módulos ES6) y [Vite](https://vite.dev/), sin frameworks.
Permite añadir gastos con nombre e importe, los muestra en una lista y calcula el total.

## Cómo arrancarlo

```bash
cd exercises/03
npm install      # instala las dependencias (Vite)
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # genera la versión de producción en dist/
```

## Reparto

| Persona | Responsabilidad | Archivos |
|---|---|---|
| A | Proyecto, HTML y entrada de datos | `index.html`, `src/style.css`, `src/validation.js`, `src/main.js` |
| B | Datos, cálculo y pintado | `src/expenses.js`, `src/render.js`, `README.md` |

Las especificaciones completas (contrato, norma de Git y checklist) están en [CLAUDE.md](CLAUDE.md).
