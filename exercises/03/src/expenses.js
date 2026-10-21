/**
 * Estado de la aplicación: lista de gastos.
 * Cada gasto tiene la forma { id, name, amount }.
 */

/**
 * Añade un gasto a la lista.
 * Se asume que los datos ya vienen validados (validateExpense).
 *
 * @param {string} name - Nombre del gasto.
 * @param {number} amount - Importe positivo del gasto.
 * @returns {void}
 */
export function addExpense(name, amount) {
  // TODO (Persona B): crear el objeto { id, name, amount } y guardarlo en el array.
}

/**
 * Devuelve los gastos añadidos, en el orden en que se añadieron.
 *
 * @returns {Array<{ id: string|number, name: string, amount: number }>}
 *   Una COPIA del array (con spread), no el array interno.
 */
export function getExpenses() {
  // TODO (Persona B): devolver una copia del array de gastos.
  return [];
}

/**
 * Calcula el total gastado.
 *
 * @returns {number} Suma de todos los importes (0 si no hay gastos).
 */
export function getTotal() {
  // TODO (Persona B): sumar los importes con reduce.
  return 0;
}
