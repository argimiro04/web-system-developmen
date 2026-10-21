/**
 * Estado de la aplicación: lista de gastos.
 * Cada gasto tiene la forma { id, name, amount }.
 *
 * El array es `const`: no se puede reasignar, pero sí modificar su contenido (push).
 * Solo se exporta a través de funciones, así nadie de fuera puede tocarlo directamente.
 */
const expenses = [];

/**
 * Añade un gasto a la lista.
 * Se asume que los datos ya vienen validados (validateExpense).
 *
 * @param {string} name - Nombre del gasto.
 * @param {number} amount - Importe positivo del gasto.
 * @returns {void}
 */
export function addExpense(name, amount) {
  // crypto.randomUUID() genera un identificador único (lo usaremos como clave de cada gasto).
  // { name, amount } es la forma abreviada de { name: name, amount: amount }.
  const expense = { id: crypto.randomUUID(), name, amount };
  expenses.push(expense);
}

/**
 * Devuelve los gastos añadidos, en el orden en que se añadieron.
 *
 * @returns {Array<{ id: string|number, name: string, amount: number }>}
 *   Una COPIA del array (con spread), no el array interno.
 */
export function getExpenses() {
  // Spread: crea un array nuevo con los mismos elementos.
  // Quien lo reciba puede ordenarlo o modificarlo sin estropear nuestro estado.
  return [...expenses];
}

/**
 * Calcula el total gastado.
 *
 * @returns {number} Suma de todos los importes (0 si no hay gastos).
 */
export function getTotal() {
  // reduce recorre el array acumulando la suma; empieza en 0, así que con la lista vacía devuelve 0.
  return expenses.reduce((sum, { amount }) => sum + amount, 0);
}
