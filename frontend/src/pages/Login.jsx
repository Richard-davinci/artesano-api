import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const { login, logout, autenticado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from?.pathname || '/perfil';

  // Envía las credenciales y muestra el resultado.
  async function handleSubmit(event) {
    event.preventDefault();
    setEnviando(true);
    setError('');

    try {
      await login(email, password);
      setPassword('');
      navigate(destino, { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setEnviando(false);
    }
  }

  if (autenticado) {
    return (
      <main className="menu">
        <h1>Sesión iniciada</h1>
        <p><Link to="/perfil">Ir a mi perfil</Link></p>
        <button type="button" onClick={logout}>Cerrar sesión</button>
      </main>
    );
  }

  return (
    <main className="menu">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="email">Email</label>{' '}
          <input id="email" name="email" type="email" autoComplete="username"
            value={email} onChange={(event) => setEmail(event.target.value)} required />
        </p>
        <p>
          <label htmlFor="password">Contraseña</label>{' '}
          <input id="password" name="password" type="password" autoComplete="current-password"
            value={password} onChange={(event) => setPassword(event.target.value)} required />
        </p>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    </main>
  );
}
