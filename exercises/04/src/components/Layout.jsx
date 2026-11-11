import { Outlet } from 'react-router-dom';
import Header from './Header';

// Placeholder de la Fase 0 — lo completa la Persona A.
// <Outlet /> es donde React Router pinta la ruta hija (Catalog, ProductDetail o Cart).
export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
