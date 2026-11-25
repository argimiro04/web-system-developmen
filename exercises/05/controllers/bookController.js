import db from '../db.js';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';

export async function getBooks(request, response) {
  const books = await db.getBooks();
  response.json(books);
}

export async function createBook(request, response) {
  const { title, author } = request.body ?? {};

  if (!isNonEmptyString(title) || !isNonEmptyString(author)) {
    return response.status(400).json({ error: 'title or author missing' });
  }

  const book = await db.addBook({ title: title.trim(), author: author.trim() });

  response.status(201).json(book);
}

export async function getBookById(request, response) {
  const { id } = request.params;
  const book = await db.getBookById(id);

  if (!book) {
    return response.status(404).json({ error: 'book not found' });
  }

  response.json(book);
}

export async function deleteBook(request, response) {
  const { id } = request.params;
  const deleted = await db.deleteBook(id);

  if (!deleted) {
    return response.status(404).json({ error: 'book not found' });
  }

  response.status(204).end();
}
