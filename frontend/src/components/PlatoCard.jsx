const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

export default function PlatoCard({ nombre, descripcion, categoria, precio }) {
  return (
    <article className="plato">
      <p className="categoria">{categoria}</p>
      <h2>{nombre}</h2>
      <p className="descripcion">{descripcion}</p>
      <p className="precio">{formatoPrecio.format(precio)}</p>
    </article>
  );
}
