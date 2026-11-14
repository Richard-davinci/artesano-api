import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Pide iniciar sesión antes de entrar a una ruta privada.
export default function RutaPrivada() {
  const { autenticado } = useAuth();
  const location = useLocation();

  if (autenticado) return <Outlet />;

  return <Navigate to="/login" replace state={{ from: location }} />;
}
