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
  // TODO (Persona A): implementar las reglas de validación.
  return { valid: true, error: '' };
}
