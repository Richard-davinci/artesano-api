import { useEffect, useState } from 'react';
import PlatoCard from './components/PlatoCard.jsx';
import { obtenerPlatos } from './services/api.js';

export default function App() {
  const [platos, setPlatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function cargarPlatos() {
      try {
        const resultado = await obtenerPlatos(controller.signal);
        if (!controller.signal.aborted) setPlatos(resultado);
      } catch {
        if (!controller.signal.aborted) setError('No pudimos cargar el menú.');
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    }

    cargarPlatos();
    return () => controller.abort();
  }, []);

  return (
    <main className="menu">
      <header>
        <p className="marca">Bodegón Arte-Sano</p>
        <h1>Menú</h1>
      </header>
      {cargando && <p role="status">Cargando menú...</p>}
      {error && <p role="alert">{error}</p>}
      {!cargando && !error && platos.length === 0 && <p>No hay platos en el menú.</p>}
      <div className="lista-platos">
        {platos.map((plato) => (
          <PlatoCard
            key={plato._id}
            nombre={plato.name}
            descripcion={plato.description}
            categoria={plato.category?.name ?? 'Sin categoría'}
            precio={plato.price}
          />
        ))}
      </div>
    </main>
  );
}
