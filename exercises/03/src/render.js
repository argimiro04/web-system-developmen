import { getExpenses, getTotal } from './expenses.js';

// Referencias a los elementos del contrato (ver CLAUDE.md).
const list = document.querySelector('#expense-list');
const total = document.querySelector('#total');

/**
 * Crea el <li> de un gasto: el nombre a la izquierda y el importe a la derecha.
 * Usa textContent, que trata el texto como texto (nunca como HTML): así evitamos XSS.
 *
 * @param {{ id: string|number, name: string, amount: number }} expense
 * @returns {HTMLLIElement}
 */
const createExpenseItem = ({ name, amount }) => {
  const li = document.createElement('li');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = name;

  const amountSpan = document.createElement('span');
  amountSpan.textContent = `${amount.toFixed(2)} €`;

  li.append(nameSpan, amountSpan);
  return li;
};

/**
 * Pinta en el DOM la lista de gastos (#expense-list) y el total (#total).
 *
 * - Vacía la lista y crea un <li> por cada gasto de getExpenses().
 * - Usa createElement/textContent (NUNCA innerHTML con datos del usuario).
 * - Muestra getTotal() con toFixed(2) en #total.
 *
 * @returns {void}
 */
export function render() {
  // 1. Vaciamos la lista: replaceChildren() sin argumentos elimina todos los hijos.
  list.replaceChildren();

  // 2. map transforma cada gasto en un <li>; luego los añadimos todos a la lista de una vez.
  const items = getExpenses().map(createExpenseItem);
  list.append(...items);

  // 3. El total siempre con 2 decimales (20 → "20.00").
  total.textContent = getTotal().toFixed(2);
}
