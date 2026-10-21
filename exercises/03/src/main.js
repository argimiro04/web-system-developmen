/**
 * Punto de entrada de la aplicación.
 * Conecta el formulario con la validación (Persona A) y con los datos y el pintado (Persona B).
 */
import './style.css';
// Default import (sin llaves): validation.js usa export default.
import validateExpense from './validation.js';
// Named imports (con llaves): el nombre tiene que coincidir con el que se exporta.
import { addExpense } from './expenses.js';
import { render } from './render.js';

// Referencias a los elementos del contrato (ver CLAUDE.md).
// Los inputs se seleccionan con un selector de atributo: [name="..."].
const form = document.querySelector('#expense-form');
const nameInput = document.querySelector('[name="expense-name"]');
const amountInput = document.querySelector('[name="expense-amount"]');
const errorMessage = document.querySelector('#error');

// Muestra (o borra, si msg es '') el mensaje de error.
const showError = (msg) => {
  errorMessage.textContent = msg;
};

form.addEventListener('submit', (event) => {
  // Evita que el navegador envíe el formulario y recargue la página.
  event.preventDefault();

  // Leemos los valores: el nombre sin espacios a los lados y el importe convertido a número.
  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);

  // Destructuring del objeto que devuelve la validación.
  const { valid, error } = validateExpense(name, amount);

  if (!valid) {
    showError(error);
    // Console API: dejamos constancia en la consola del motivo y de los valores rechazados.
    console.warn(`Gasto rechazado: ${error}`, { name, amount });
    return;
  }

  showError('');
  addExpense(name, amount);
  render();

  // Dejamos el formulario listo para el siguiente gasto.
  nameInput.value = '';
  amountInput.value = '';
  nameInput.focus();
});

// Pintado inicial (lista vacía y total 0.00).
render();
