// TODO Persona B: datos iniciales (CLAUDE.md, sección 3.1) y operaciones inmutables
let books = [];

async function getBooks() {
  return books;
}

async function getBookById(id) {
  return undefined;
}

async function addBook({ title, author }) {
  return { id: '0', title, author };
}

async function deleteBook(id) {
  return false;
}

export default { getBooks, getBookById, addBook, deleteBook };
