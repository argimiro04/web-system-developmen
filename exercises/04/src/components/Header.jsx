import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Header() {
  // Context API: leemos el carrito del Provider con useContext, sin recibirlo por props.
  // Cuando cartItems cambia en el Provider, React vuelve a pintar el Header solo.
  const { cartItems } = useContext(CartContext);

  // Unidades, no filas: 2 Mouse + 1 Laptop = 3. Se calcula en cada render con reduce,
  // no hace falta guardarlo en otro estado porque sale de cartItems.
  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* <Link> cambia la URL sin recargar la página: el estado (el carrito) no se pierde.
            Con <a href> el navegador recargaría todo y el carrito volvería a estar vacío. */}
        <Link to="/" className="brand" data-testid="nav-home">
          Mini Shop
        </Link>
        <nav>
          <Link to="/cart" className="cart-link" data-testid="nav-cart">
            Cart
            {/* Solo el número dentro del data-testid; la etiqueta "Cart" va fuera. */}
            <span className="cart-badge" data-testid="cart-count">{totalUnits}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
