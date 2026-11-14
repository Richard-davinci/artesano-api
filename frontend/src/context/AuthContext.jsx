import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { iniciarSesion } from '../services/api.js';

const AuthContext = createContext(null);

// Lee los datos de un token vigente.
function obtenerSesion(token) {
  if (!token) return { token: null, user: null };

  try {
    const payload = jwtDecode(token);
    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      return { token: null, user: null };
    }

    const user = { id: payload._id, name: payload.name, role: payload.role };
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

// Recupera la sesión al recargar la página.
function restaurarSesion() {
  const sesion = obtenerSesion(sessionStorage.getItem('token'));
  if (!sesion.token) sessionStorage.removeItem('token');
  return sesion;
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(restaurarSesion);

  // Guarda el token que devuelve la API.
  async function login(email, password) {
    const datos = await iniciarSesion(email, password);
    if (!datos.token) throw new Error('La API no devolvió un token.');

    const nuevaSesion = obtenerSesion(datos.token);
    if (!nuevaSesion.token) throw new Error('El token es inválido o está vencido.');

    sessionStorage.setItem('token', nuevaSesion.token);
    setSesion(nuevaSesion);
  }

  // Borra la sesión de la pestaña.
  function logout() {
    sessionStorage.removeItem('token');
    setSesion({ token: null, user: null });
  }

  return (
    <AuthContext.Provider value={{
      token: sesion.token,
      user: sesion.user,
      autenticado: Boolean(sesion.token && sesion.user),
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
