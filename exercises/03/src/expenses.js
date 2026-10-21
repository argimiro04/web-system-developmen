/**
 * Estado de la aplicación: lista de gastos.
 * Cada gasto tiene la forma { id, name, amount }.
 *
 * El array nunca se modifica: cada cambio crea un array NUEVO (concat, filter)
 * y lo asignamos a `expenses`. Por eso es `let` y no `const`.
 * Solo se accede a él a través de las funciones exportadas.
 */

// Clave con la que guardamos los gastos en localStorage.
const STORAGE_KEY = 'budget-tracker-expenses';

/**
 * Lee los gastos guardados en localStorage.
 * Si no hay nada guardado o el JSON está corrupto, devuelve una lista vacía.
 *
 * @returns {Array<{ id: number, name: string, amount: number }>}
 */
const loadExpenses = () => {
  try {
    // JSON.parse convierte el texto guardado en un array de objetos.
    // Si no hay nada guardado, getItem devuelve null y JSON.parse(null) devuelve null.
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // Array.isArray comprueba que lo guardado es de verdad una lista (y no null u otro valor).
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    // JSON.parse lanza un error si el texto no es JSON válido: avisamos y empezamos de cero.
    console.error('No se pudieron cargar los gastos guardados:', error);
    return [];
  }
};

let expenses = loadExpenses();

// El siguiente id continúa desde el mayor de los gastos cargados (o empieza en 1 si no hay).
let nextId = expenses.reduce((max, { id }) => (id > max ? id : max), 0) + 1;

/**
 * Guarda los gastos en localStorage como texto JSON.
 * Es interna (no se exporta): se llama después de añadir o borrar.
 *
 * @returns {void}
 */
const saveExpenses = () => {
  // JSON.stringify convierte el array de objetos en un texto que localStorage puede guardar.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};

/**
 * Añade un gasto a la lista.
 * Se asume que los datos ya vienen validados (validateExpense).
 *
 * @param {string} name - Nombre del gasto.
 * @param {number} amount - Importe positivo del gasto.
 * @returns {void}
 */
export function addExpense(name, amount) {
  // { id, name, amount } es la forma abreviada de { id: id, name: name, amount: amount }.
  const expense = { id: nextId, name, amount };
  nextId += 1;

  // concat NO modifica el array original: devuelve uno nuevo con el gasto añadido al final.
  expenses = expenses.concat(expense);
  saveExpenses();
}

/**
 * Elimina el gasto con el id indicado.
 *
 * @param {number} id - Identificador del gasto a borrar.
 * @returns {void}
 */
export function removeExpense(id) {
  // filter devuelve un array nuevo solo con los gastos cuyo id es distinto del que borramos.
  expenses = expenses.filter((expense) => expense.id !== id);
  saveExpenses();
}

/**
 * Devuelve los gastos añadidos, en el orden en que se añadieron.
 *
 * @returns {Array<{ id: number, name: string, amount: number }>}
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
