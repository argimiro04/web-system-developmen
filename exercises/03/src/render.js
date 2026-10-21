import { getExpenses, getTotal, removeExpense } from './expenses.js';

// Referencias a los elementos del contrato (ver CLAUDE.md).
const list = document.getElementById('expense-list');
const total = document.getElementById('total');

/**
 * Crea el <li> de un gasto: el nombre, el importe y un botón para borrarlo.
 * Usa textContent, que trata el texto como texto (nunca como HTML): así evitamos XSS.
 *
 * @param {{ id: number, name: string, amount: number }} expense
 * @returns {HTMLLIElement}
 */
const createExpenseItem = ({ id, name, amount }) => {
  const li = document.createElement('li');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = name;

  const amountSpan = document.createElement('span');
  amountSpan.textContent = `${amount.toFixed(2)} €`;

  // Botón de borrar: type="button" para que no envíe el formulario.
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('type', 'button');
  deleteButton.classList.add('delete-btn');
  deleteButton.textContent = 'Borrar';
  deleteButton.setAttribute('aria-label', `Borrar ${name}`);

  // Al hacer clic borramos este gasto (la arrow function "recuerda" su id) y repintamos.
  deleteButton.addEventListener('click', () => {
    removeExpense(id);
    render();
  });

  li.appendChild(nameSpan);
  li.appendChild(amountSpan);
  li.appendChild(deleteButton);
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
  // 1. Vaciamos la lista. innerHTML solo se usa con '' (sin datos del usuario).
  list.innerHTML = '';

  // 2. Por cada gasto creamos su <li> y lo colgamos de la lista.
  getExpenses().forEach((expense) => {
    list.appendChild(createExpenseItem(expense));
  });

  // 3. El total siempre con 2 decimales (20 → "20.00").
  total.textContent = getTotal().toFixed(2);
}
