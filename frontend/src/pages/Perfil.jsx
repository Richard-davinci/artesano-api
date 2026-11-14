import { useAuth } from '../context/AuthContext.jsx';

export default function Perfil() {
  const { user, logout } = useAuth();

  return (
    <main className="menu">
      <h1>Mi perfil</h1>
      <ul>
        <li><strong>Nombre:</strong> {user.name}</li>
        <li><strong>Rol:</strong> {user.role}</li>
      </ul>
      <button type="button" onClick={logout}>Cerrar sesión</button>
    </main>
  );
}
