import Layout from './components/Layout';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';

// Rutas como array (patrón "Refactoring the routes"): main.jsx hace createBrowserRouter(routes).
// Layout es la ruta padre: pinta el Header y, en su <Outlet />, la ruta hija que toque.
// errorElement en la raíz: cualquier URL que no encaje muestra NotFound.
const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Catalog /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
    ],
  },
];

export default routes;
