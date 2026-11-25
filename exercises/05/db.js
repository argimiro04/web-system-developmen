// Mock DB (diapositiva "Using a quick mock DB"): los libros viven en memoria.
// Al reiniciar el servidor el array vuelve a estos tres libros, porque no hay base de datos.
// El id es un STRING: los params de la URL (request.params.id) llegan como string,
// así el controlador puede comparar directamente sin convertir.
let books = [
  { id: '1', title: 'Clean Code', author: 'Robert C. Martin' },
  { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas' },
  { id: '3', title: 'Eloquent JavaScript', author: 'Marijn Haverbeke' },
];

// Interno (no se exporta): el id lo genera el servidor, nunca el cliente.
// Igual que en "Adding a new note": el mayor id actual + 1, devuelto como string.
// Limitación conocida: si se borra el libro con el id más alto, su id se reutiliza.
function generateId() {
  const maxId = books.length > 0 ? Math.max(...books.map((b) => Number(b.id))) : 0;
  return String(maxId + 1);
}

// Todas las funciones son async aunque no haya BD: el controlador ya usa await,
// y en el Módulo 06 solo habrá que cambiar este archivo por consultas reales.
async function getBooks() {
  return books;
}

async function getBookById(id) {
  return books.find((book) => book.id === id);
}

// Recibe title y author YA validados por el controlador (la validación no es de esta capa).
// Se construye un objeto nuevo con solo los tres campos del contrato.
async function addBook({ title, author }) {
  const book = { id: generateId(), title, author };
  // concat devuelve un array nuevo: no mutamos el original (nada de push)
  books = books.concat(book);
  return book;
}

// Devuelve true si existía y se ha borrado, false si no existía.
// Así el controlador puede responder 204 o 404 según el resultado.
async function deleteBook(id) {
  const exists = books.some((book) => book.id === id);
  if (!exists) {
    return false;
  }
  // filter devuelve un array nuevo sin el libro: se reasigna, no se usa splice
  books = books.filter((book) => book.id !== id);
  return true;
}

export default { getBooks, getBookById, addBook, deleteBook };
