import { Outlet } from 'react-router-dom';
import Header from './Header';

// Layout es el "marco" común de la app: la ruta padre "/" lo pinta siempre.
// El Header se queda fijo y <Outlet /> es el hueco donde React Router coloca la ruta hija
// que coincide con la URL (Catalog, ProductDetail o Cart). Así no repetimos el Header en cada página.
export default function Layout() {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
