import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

// Formulario de pedido. Recibe por props la función onOrderPlaced del padre (Cart),
// que es quien guarda el nombre confirmado (lifting state up).
export default function CheckoutForm({ onOrderPlaced }) {
  // Componente controlado: el valor del input sale de este estado y cada tecla lo actualiza.
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState('');
  const { clearCart } = useContext(CartContext);

  const handleSubmit = (e) => {
    // Sin esto el navegador enviaría el formulario y recargaría la página (y se perdería el carrito).
    e.preventDefault();

    // trim(): un nombre con solo espacios cuenta como vacío → no se hace el pedido.
    const name = customerName.trim();
    if (name === '') {
      setError('Please enter your name.');
      return;
    }

    clearCart();          // vacía el carrito (función del Context)
    onOrderPlaced(name);  // avisa al padre para que muestre la confirmación
    setCustomerName('');  // limpia el input
    setError('');
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="checkout-input"
        placeholder="Your name"
        aria-label="Your name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        data-testid="customer-name"
      />
      <button type="submit" className="button" data-testid="checkout">
        Checkout
      </button>
      {/* Renderizado condicional con &&: el error solo aparece si hay mensaje. */}
      {error && <p className="checkout-error" role="alert">{error}</p>}
    </form>
  );
}
