// Datos del contrato (congelados): id numérico y price como número, no string.
// No hay backend: la app importa este array directamente.
const products = [
  { id: 1, name: 'Laptop',   price: 999.99, description: 'Lightweight 14" laptop with 16 GB RAM.' },
  { id: 2, name: 'Mouse',    price: 25.5,   description: 'Wireless ergonomic mouse with silent clicks.' },
  { id: 3, name: 'Keyboard', price: 75,     description: 'Mechanical keyboard with backlit keys.' },
  { id: 4, name: 'Monitor',  price: 189.9,  description: '24" Full HD monitor with thin bezels.' },
];
export default products;
