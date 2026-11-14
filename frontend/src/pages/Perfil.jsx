import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiUrl, obtenerPerfil, subirFotoPerfil } from '../services/api.js';

export default function Perfil() {
  const { token, user, logout } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarPerfil() {
      try {
        const datos = await obtenerPerfil(token);
        if (activo) setPerfil(datos);
      } catch (error) {
        if (activo) setError(error.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarPerfil();
    return () => {
      activo = false;
    };
  }, [token]);

  useEffect(() => {
    if (preview) return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const imagenActual = preview || (perfil?.profileImage ? `${apiUrl}${perfil.profileImage}` : null);

  // Valida y muestra una vista previa de la foto elegida.
  function seleccionarImagen(evento) {
    const foto = evento.target.files[0];
    setArchivo(null);
    setPreview(null);
    setError('');
    setMensaje('');
    if (!foto) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(foto.type)) {
      setError('Elegí una imagen JPEG, PNG o WebP.');
      evento.target.value = '';
      return;
    }
    if (foto.size > 2 * 1024 * 1024) {
      setError('La imagen no puede superar los 2 MB.');
      evento.target.value = '';
      return;
    }

    setArchivo(foto);
    setPreview(URL.createObjectURL(foto));
  }

  // Guarda la foto y actualiza el perfil.
  async function guardarImagen(evento) {
    evento.preventDefault();
    if (!archivo) return;

    const formulario = evento.currentTarget;
    setSubiendo(true);
    setError('');
    setMensaje('');

    try {
      setPerfil(await subirFotoPerfil(token, archivo));
      formulario.reset();
      setArchivo(null);
      setPreview(null);
      setMensaje('Foto de perfil actualizada.');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <main className="menu">
      <h1>Mi perfil</h1>
      <ul>
        <li><strong>Nombre:</strong> {perfil?.name || user.name}</li>
        {perfil && <li><strong>Email:</strong> {perfil.email}</li>}
        <li><strong>Rol:</strong> {user.role}</li>
      </ul>
      {cargando && <p role="status">Cargando perfil...</p>}
      {perfil && (
        <>
          {imagenActual
            ? <img src={imagenActual} alt="Foto de perfil" width={128} />
            : <p>Sin foto de perfil.</p>}
          <form onSubmit={guardarImagen}>
            <label htmlFor="profileImage">Seleccionar foto</label>{' '}
            <input id="profileImage" type="file" accept="image/jpeg,image/png,image/webp"
              onChange={seleccionarImagen} disabled={subiendo} />
            <button type="submit" disabled={!archivo || subiendo}>
              {subiendo ? 'Guardando...' : 'Guardar foto'}
            </button>
          </form>
        </>
      )}
      {error && <p role="alert">{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}
      <button type="button" onClick={logout}>Cerrar sesión</button>
    </main>
  );
}
