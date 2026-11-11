import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import products from '../data/products';
import formatPrice from '../utils/formatPrice';

export default function ProductDetail() {
  // Segmento dinámico: en la ruta "products/:id", useParams nos da { id } a partir de la URL.
  // El valor llega SIEMPRE como string ("2"), y en products.js el id es número (2).
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  // Number(id) antes de comparar: "2" === 2 es false y no encontraría nada.
  // Como los productos se importan del archivo (no hay fetch), la página funciona
  // aunque se abra la URL directamente, sin pasar antes por el catálogo.
  const product = products.find((p) => p.id === Number(id));

  // Renderizado condicional con return temprano: si el id no existe, otro contenido.
  if (!product) {
    return (
      <section className="detail">
        <p className="empty" data-testid="product-not-found">Product not found.</p>
        <Link to="/" className="button">Back to the catalog</Link>
      </section>
    );
  }

  return (
    <section className="detail">
      <h1 data-testid="product-name">{product.name}</h1>
      <p className="price" data-testid="product-price">{formatPrice(product.price)}</p>
      <p data-testid="product-description">{product.description}</p>
      <div className="detail-actions">
        {/* Misma función del Context que en el catálogo: si el producto ya está, B suma 1 a su cantidad. */}
        <button type="button" className="button" onClick={() => addToCart(product)} data-testid="add-to-cart">
          Add to Cart
        </button>
        <Link to="/" className="link-back">← Back to the catalog</Link>
      </div>
    </section>
  );
}
