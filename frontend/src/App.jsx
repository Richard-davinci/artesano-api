const plato = {
  nombre: 'Ravioles de ricota con filetto',
  descripcion: 'Ravioles rellenos de ricota con salsa de tomate y albahaca.',
  categoria: 'Pastas',
  precio: 13500
};

const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

export default function App() {
  return (
    <main className="menu">
      <header>
        <p className="marca">Bodegón Arte-Sano</p>
        <h1>Menú</h1>
      </header>
      <article className="plato">
        <p className="categoria">{plato.categoria}</p>
        <h2>{plato.nombre}</h2>
        <p className="descripcion">{plato.descripcion}</p>
        <p className="precio">{formatoPrecio.format(plato.precio)}</p>
      </article>
    </main>
  );
}
