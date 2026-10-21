/**
 * Punto de entrada de la aplicación.
 * Conecta el formulario con la validación (Persona A) y con los datos y el pintado (Persona B).
 */
import './style.css';
import { validateExpense } from './validation.js';
import { addExpense } from './expenses.js';
import { render } from './render.js';

const form = document.querySelector('#expense-form');

// TODO (Persona A): añadir el listener 'submit' al formulario:
//   1. preventDefault() para que la página no se recargue.
//   2. Leer los valores de expense-name (trim) y expense-amount (Number).
//   3. validateExpense(name, amount):
//      - si no es válido, mostrar el error en #error;
//      - si es válido, limpiar #error, llamar a addExpense() y render(),
//        limpiar los inputs y devolver el foco al nombre.

// Pintado inicial (lista vacía y total 0.00).
render();
