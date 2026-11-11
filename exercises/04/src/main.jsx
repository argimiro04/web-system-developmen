import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import routes from './routes';
import './index.css';

const router = createBrowserRouter(routes);

// CartProvider envuelve al router: el carrito vive por encima de todas las páginas,
// así que navegar entre rutas no lo vacía.
// StrictMode se queda: en desarrollo ejecuta dos veces el render y las funciones de setState
// para destapar mutaciones del estado.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
);
