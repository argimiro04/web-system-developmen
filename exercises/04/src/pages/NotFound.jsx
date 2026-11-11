import { Link } from 'react-router-dom';

// errorElement de la ruta raíz: React Router lo pinta cuando la URL no coincide con ninguna ruta.
// Ojo: sustituye a todo el Layout, así que aquí no hay Header.
// Por eso NotFound necesita su propio <Link> para volver a la tienda.
export default function NotFound() {
  return (
    <main className="container not-found" data-testid="not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="button">Back to the shop</Link>
    </main>
  );
}
