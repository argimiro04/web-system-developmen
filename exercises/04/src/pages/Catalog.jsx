import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

export default function Catalog() {
  // Estado local del buscador: solo le importa a esta página, así que no va al Context.
  const [query, setQuery] = useState('');
  // Context API: addToCart viene del Provider, no por props.
  const { addToCart } = useContext(CartContext);

  // El filtrado NO es otro estado: se calcula en cada render a partir de query y products.
  // Si lo guardáramos en un useState, tendríamos dos fuentes de verdad que mantener sincronizadas.
  // toLowerCase() en los dos lados → la búsqueda no distingue mayúsculas ("LAP" encuentra "Laptop").
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section>
      <h1>Catalog</h1>

      {/* Componente controlado: el valor del input sale del estado (value={query})
          y cada tecla actualiza ese estado con onChange. React es la única fuente de verdad. */}
      <input
        type="search"
        className="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        data-testid="search"
      />

      {/* Renderizado condicional: si no hay resultados, mensaje; si los hay, la rejilla. */}
      {filteredProducts.length === 0 ? (
        <p className="empty" data-testid="no-results">No products match your search.</p>
      ) : (
        <div className="grid">
          {/* Lista con map: cada elemento necesita una key estable y única (el id),
              para que React sepa qué tarjeta es cuál al filtrar y no la confunda con otra. */}
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              // Arrow function: se crea una función que llama a addToCart(product) al hacer clic.
              // Escribir onAdd={addToCart(product)} la ejecutaría en cada render ("Too many re-renders").
              onAdd={() => addToCart(product)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
