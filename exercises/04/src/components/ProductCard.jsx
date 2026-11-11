import { Link } from 'react-router-dom';
import formatPrice from '../utils/formatPrice';

// Componente reutilizable con props: recibe el producto y la función que se ejecuta al pulsar el botón.
// Destructuring de props en los parámetros: ({ product, onAdd }) en lugar de props.product, props.onAdd.
// La tarjeta no sabe nada del carrito: solo avisa "me han pulsado" llamando a onAdd.
export default function ProductCard({ product, onAdd }) {
  const { id, name, price } = product;

  return (
    <article className="card" data-testid={`product-${id}`}>
      {/* Segmento dinámico: la URL lleva el id, y ProductDetail lo lee con useParams. */}
      <Link to={`/products/${id}`} className="card-title" data-testid={`product-link-${id}`}>
        {name}
      </Link>
      <p className="price" data-testid={`price-${id}`}>{formatPrice(price)}</p>
      {/* Pasamos una función, no la llamamos: onClick={onAdd} se ejecuta solo al hacer clic. */}
      <button type="button" className="button" onClick={onAdd} data-testid={`add-${id}`}>
        Add to Cart
      </button>
    </article>
  );
}
