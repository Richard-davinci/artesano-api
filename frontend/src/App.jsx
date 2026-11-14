import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Menu from './pages/Menu.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <nav aria-label="Navegación principal">
        <Link to="/">Menú</Link>{' · '}
        <Link to="/login">Iniciar sesión</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
