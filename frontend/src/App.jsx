import PlatoCard from './components/PlatoCard.jsx';

const platos = [
  {
    id: 1,
    nombre: 'Ravioles de ricota con filetto',
    descripcion: 'Ravioles rellenos de ricota con salsa de tomate y albahaca.',
    categoria: 'Pastas',
    precio: 13500
  },
  {
    id: 2,
    nombre: 'Pizza de muzzarella',
    descripcion: 'Salsa de tomate, muzzarella, aceitunas y orégano.',
    categoria: 'Pizzas',
    precio: 12000
  },
  {
    id: 3,
    nombre: 'Empanada de carne',
    descripcion: 'Empanada al horno con carne, cebolla y morrón.',
    categoria: 'Empanadas',
    precio: 2200
  }
];

export default function App() {
  return (
    <main className="menu">
      <header>
        <p className="marca">Bodegón Arte-Sano</p>
        <h1>Menú</h1>
      </header>
      <div className="lista-platos">
        {platos.map((plato) => (
          <PlatoCard
            key={plato.id}
            nombre={plato.nombre}
            descripcion={plato.descripcion}
            categoria={plato.categoria}
            precio={plato.precio}
          />
        ))}
      </div>
    </main>
  );
}
