export const apiUrl = (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:3001').replace(/\/+$/, '');

export async function obtenerPlatos(signal) {
  const respuesta = await fetch(`${apiUrl}/api/dishes`, { signal });
  if (!respuesta.ok) throw new Error('No se pudieron obtener los platos');

  const { data } = await respuesta.json();
  if (!Array.isArray(data)) throw new Error('La respuesta no contiene una lista de platos');
  return data;
}

export async function iniciarSesion(email, password) {
  const respuesta = await fetch(`${apiUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo iniciar sesión.');
  }
  return respuesta.json();
}

// Envía el token en las solicitudes privadas.
async function fetchPrivado(endpoint, token, options = {}) {
  const respuesta = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}` }
  });
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new Error(datos?.message || 'No se pudo completar la solicitud.');
  }
  return datos.data;
}

export function obtenerPerfil(token) {
  return fetchPrivado('/api/auth/me', token);
}

export function subirFotoPerfil(token, archivo) {
  const formData = new FormData();
  formData.append('profileImage', archivo);
  return fetchPrivado('/api/auth/profileimage', token, { method: 'POST', body: formData });
}
