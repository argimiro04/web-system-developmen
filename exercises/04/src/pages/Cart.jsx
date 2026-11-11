import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';
import formatPrice from '../utils/formatPrice';
import './Cart.css';

export default function Cart() {
  // Context API: el carrito y sus funciones vienen del Provider, no por props.
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

  // Lifting state up: el nombre del pedido confirmado vive aquí, en el padre, y no en CheckoutForm.
  // CheckoutForm solo avisa con onOrderPlaced(nombre). Así el mensaje sigue visible
  // aunque el carrito se quede vacío y el formulario deje de pintarse.
  const [confirmedName, setConfirmedName] = useState('');

  // El total no es estado: se calcula en cada render a partir de cartItems con reduce (precio × cantidad).
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Sin return temprano cuando está vacío: todo se decide con renderizado condicional en el mismo return,
  // para no perder la confirmación del pedido.
  return (
    <section className="cart">
      <h1>Cart</h1>

      {/* Se muestra siempre que haya un pedido confirmado (también con el carrito ya vacío). */}
      {confirmedName && (
        <p className="order-confirmation" data-testid="order-confirmation">
          Thank you for your order, {confirmedName}!
        </p>
      )}

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p className="empty" data-testid="cart-empty">Your cart is empty.</p>
          <Link to="/" className="link-back">← Back to the catalog</Link>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {/* Lista con map y key estable (el id del producto): una fila por producto. */}
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item" data-testid={`cart-item-${item.id}`}>
                <span className="cart-item-name">{item.name}</span>

                <div className="cart-qty">
                  {/* Arrow functions: pasamos una función que se ejecuta al hacer clic, no la llamamos aquí.
                      Bajar de 1 a 0 hace que updateQuantity quite la fila. */}
                  <button
                    type="button"
                    className="qty-button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    data-testid={`decrease-${item.id}`}
                    aria-label={`Decrease ${item.name}`}
                  >
                    −
                  </button>
                  {/* Solo el número dentro del data-testid. */}
                  <span className="qty-value" data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                  <button
                    type="button"
                    className="qty-button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    data-testid={`increase-${item.id}`}
                    aria-label={`Increase ${item.name}`}
                  >
                    +
                  </button>
                </div>

                <span className="cart-item-subtotal">{formatPrice(item.price * item.quantity)}</span>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                  data-testid={`remove-${item.id}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <p className="cart-total-line">
            Total: <strong data-testid="cart-total">{formatPrice(total)}</strong>
          </p>

          {/* Props: le pasamos al hijo la función que actualiza nuestro estado (setConfirmedName).
              El formulario solo se muestra si hay algo que comprar. */}
          <CheckoutForm onOrderPlaced={setConfirmedName} />
        </>
      )}
    </section>
  );
}
