import { createContext, useState } from 'react';

// Context API (diapositiva "Creating the context"): estos valores por defecto solo se usan
// si un componente lee el contexto fuera del Provider. La interfaz es el contrato.
export const CartContext = createContext({
  cartItems: [], addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {},
});

export function CartProvider({ children }) {
  // Estado global del carrito: una fila por producto, { id, name, price, quantity }.
  // Vive en el Provider (por encima del router), así que navegar entre páginas no lo vacía.
  const [cartItems, setCartItems] = useState([]);


  // Siempre se crea un array NUEVO (map, filter, concat) y, si cambia una fila, un objeto NUEVO con spread.
  // Así React detecta el cambio y StrictMode no duplica cantidades.

  const addToCart = (product) => {
    const alreadyInCart = cartItems.find((item) => item.id === product.id);

    if (alreadyInCart) {
      // Ya está: misma lista, pero la fila de ese producto se sustituye por una copia con quantity + 1.
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    } else {
      // No está: concat devuelve un array nuevo con la fila añadida al final (no modifica el original).
      // Solo guardamos lo que necesita el carrito (no la descripción).
      const { id, name, price } = product;
      setCartItems(cartItems.concat({ id, name, price, quantity: 1 }));
    }
  };

  // filter devuelve un array nuevo con todas las filas menos la del id indicado.
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    // Al llegar a 0 o menos la fila desaparece: reutilizamos removeFromCart.
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    // map + spread: copia de la fila con la nueva cantidad; el resto de filas se quedan igual.
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  // Se usa al hacer el pedido: el carrito pasa a ser un array vacío nuevo.
  const clearCart = () => {
    setCartItems([]);
  };

  // El Provider "reparte" el carrito y sus funciones a cualquier componente que esté dentro,
  // por profundo que esté, sin pasar props de padre a hijo.
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
