import { createContext, useState } from 'react';

// STUB de la Fase 0: la interfaz es el contrato (CLAUDE.md, sección 3.2).
// La Persona B rellena las funciones sin cambiar nombres ni parámetros.
export const CartContext = createContext({
  cartItems: [], addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {},
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  // TODO Persona B: implementar de forma inmutable
  const addToCart = (product) => {};
  const removeFromCart = (id) => {};
  const updateQuantity = (id, quantity) => {};
  const clearCart = () => {};
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
