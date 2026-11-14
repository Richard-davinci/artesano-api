import { useState } from 'react';
import { iniciarSesion } from '../services/api.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Envía las credenciales y muestra el resultado.
  async function handleSubmit(event) {
    event.preventDefault();
    setEnviando(true);
    setError('');
    setMensaje('');

    try {
      const resultado = await iniciarSesion(email, password);
      setPassword('');
      setMensaje(resultado.message || 'Sesión iniciada.');
    } catch (error) {
      setError(error.message);
    } finally {
      setEnviando(false);
    }
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
        {mensaje && <p role="status">{mensaje}</p>}
      </form>
    </main>
  );
}
