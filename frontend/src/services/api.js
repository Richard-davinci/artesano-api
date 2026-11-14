const apiUrl = (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:3001').replace(/\/+$/, '');

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
