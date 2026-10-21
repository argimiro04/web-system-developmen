/**
 * Valida los datos de un gasto antes de añadirlo.
 *
 * Reglas:
 * - name no puede estar vacío ni ser solo espacios.
 * - amount debe ser un número válido (no NaN) y estrictamente positivo (> 0).
 *
 * @param {string} name - Nombre del gasto (ya recortado con trim()).
 * @param {number} amount - Importe del gasto (ya convertido con Number()).
 * @returns {{ valid: boolean, error: string }} valid indica si es correcto;
 *   error contiene un mensaje claro para el usuario ('' si es válido).
 */
export function validateExpense(name, amount) {
  // Volvemos a aplicar trim() por seguridad: un nombre de solo espacios queda en ''.
  if (name.trim() === '') {
    return { valid: false, error: 'Escribe el nombre del gasto.' };
  }

  // Number.isFinite descarta NaN (texto no numérico) e Infinity.
  if (!Number.isFinite(amount)) {
    return { valid: false, error: 'El importe debe ser un número.' };
  }

  // 0 y negativos no son gastos válidos. Number('') vale 0, así que el importe vacío también cae aquí.
  if (amount <= 0) {
    return { valid: false, error: 'Escribe un importe mayor que 0.' };
  }

  return { valid: true, error: '' };
}
