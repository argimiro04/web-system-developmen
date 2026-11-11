// 25.5 → "$25.50". Se usa en catálogo, detalle y carrito para que todo coincida.
const formatPrice = (value) => `$${value.toFixed(2)}`;
export default formatPrice;
