// Copia un texto y muestra el resultado en el botón.
const copyText = async (text, button) => {
  const originalText = button.textContent;

  try {
    await navigator.clipboard.writeText(text);
    button.textContent = '¡Copiado!';
  } catch (error) {
    // Permite copiar manualmente si el navegador bloquea el portapapeles.
    window.prompt('Copiá este contenido:', text);
  }

  setTimeout(() => {
    button.textContent = originalText;
  }, 1800);
};

// Ejemplos de cuerpos JSON.
const categoryExample = {
  name: 'Categoría de prueba',
  description: 'Categoría creada '
};

const dishExample = {
  name: 'Plato de prueba',
  description: 'Plato temporal creado ',
  price: 1000,
  available: true,
  category: '6aab87590770a223e2d18630'
};

const updateExample = {
  name: 'Plato de prueba actualizado',
  description: 'Plato temporal actualizado ',
  price: 1500,
  available: false,
  category: '6aab87590770a223e2d18630'
};

// Recorre únicamente las filas que contienen endpoints.
document.querySelectorAll('table tbody tr').forEach((row) => {
  const methodElement = row.querySelector('.method');

  // Omite los títulos "Platos" y "Categorías".
  if (!methodElement) {
    return;
  }

  const method = methodElement.textContent.trim();
  const urlCell = row.cells[1];
  const urlElement = urlCell.querySelector('a, code');

  if (!urlElement) {
    return;
  }

  // Usa el href en GET y el texto de la URL en los otros métodos.
  const originalUrl = urlElement.getAttribute('href')
    || urlElement.textContent.trim();

  const parsedUrl = new URL(originalUrl, window.location.origin);
  const path = parsedUrl.pathname;

  // Conserva la ruta y los filtros, usando el servidor actual.
  const fullUrl = `${window.location.origin}${path}${parsedUrl.search}`;

  urlElement.textContent = fullUrl;

  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'copy-button';
  copyButton.textContent = 'Copiar URL';
  copyButton.setAttribute(
    'aria-label',
    `Copiar URL de ${method} ${path}`
  );

  copyButton.addEventListener('click', () => {
    copyText(fullUrl, copyButton);
  });

  const urlContainer = document.createElement('div');
  urlContainer.className = 'endpoint-url';

  urlElement.replaceWith(urlContainer);
  urlContainer.append(urlElement, copyButton);

  if (!['POST', 'PUT', 'DELETE'].includes(method) && path !== '/api/auth/me') {
    return;
  }

  const details = document.createElement('details');
  details.className = 'request-example';

  const summary = document.createElement('summary');
  summary.textContent = 'Ejemplo';

  const instructions = document.createElement('p');

  details.append(summary, instructions);

  let body;

  const isCategory = path.startsWith('/api/categories');

  if (path === '/api/auth/register') {
    instructions.textContent = 'Enviá nombre, email y una contraseña de prueba. Esperado: 201; email repetido: 409.';
    body = { name: 'Usuario de prueba', email: 'prueba.artesano@example.com', password: 'CambiarEjemplo1!' };
  } else if (path === '/api/auth/login') {
    instructions.textContent = 'Usá los datos de tu cuenta de prueba. Esperado: 200 con token; credenciales incorrectas: 401.';
    body = { email: 'prueba.artesano@example.com', password: 'CambiarEjemplo1!' };
  } else if (path === '/api/auth/me') {
    instructions.textContent = 'Agregá Authorization: Bearer TU_TOKEN. Esperado: 200 con el perfil; sin token válido: 401.';
  } else if (method === 'POST' && isCategory) {
    instructions.textContent =
      'Seleccioná POST y Body → JSON. Probá sin token: 401; '
      + 'con Authorization: Bearer TU_TOKEN de usuario común: 403; '
      + 'con token de administrador y nombre disponible: 201. '
      + 'Copiá el data._id de la respuesta para consultar, '
      + 'actualizar y eliminar esta categoría de prueba. '
      + 'Para probar un duplicado, volvé a enviar el mismo JSON con el mismo token de administrador. '
      + 'Esperado: 409 Conflict, «Ya existe una categoría con ese nombre».';

    body = categoryExample;

  } else if (method === 'POST') {
    instructions.textContent =
      'Seleccioná POST y Body → JSON. Sin token: 401; con token de usuario común: 403. '
      + 'Con Authorization: Bearer TU_TOKEN de administrador y datos válidos: 201. '
      + 'Copiá el data._id para probar PUT y DELETE. '
      + 'El campo category debe contener el ID de una categoría existente.';

    body = dishExample;

  } else if (method === 'PUT' && isCategory) {
    instructions.textContent =
      'Seleccioná PUT y reemplazá :id por el ID de la categoría '
      + 'de prueba. En Body → JSON enviá nombre y descripción. '
      + 'Probá sin token: 401; con token de usuario común: 403; '
      + 'con Authorization: Bearer TU_TOKEN de administrador y datos válidos: 200. '
      + 'Si el nombre pertenece a otra categoría: 409.';

    body = {
      name: 'Categoría de prueba actualizada',
      description: 'Descripción modificada desde Thunder Client'
    };

  } else if (method === 'PUT') {
    instructions.textContent =
      'Seleccioná PUT y reemplazá :id por el ID del plato de prueba. '
      + 'Elegí Body → JSON y enviá los cinco campos. '
      + 'Usá una categoría existente. Sin token: 401; con token de usuario común: 403. '
      + 'Con Authorization: Bearer TU_TOKEN de administrador y datos válidos: 200.';

    body = updateExample;

  } else if (method === 'DELETE' && isCategory) {
    instructions.textContent =
      'Seleccioná DELETE y reemplazá :id por el ID de la categoría '
      + 'de prueba. Dejá Body vacío. Sin token: 401; con token de usuario común: 403. '
      + 'Con Authorization: Bearer TU_TOKEN de administrador y sin platos asociados: 200. '
      + 'Si tiene platos asociados, devuelve 400 y no la elimina.';

  } else if (method === 'DELETE') {
    instructions.textContent =
      'Seleccioná DELETE y reemplazá :id por el ID del plato '
      + 'de prueba. Dejá Body vacío. Sin token: 401; con token de usuario común: 403. '
      + 'Con Authorization: Bearer TU_TOKEN de administrador y un plato existente: 200. '
      + 'Consultar después ese ID con GET debe devolver 404.';
  }

  if (body) {
    const json = JSON.stringify(body, null, 2);

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = json;
    pre.append(code);

    const copyJsonButton = document.createElement('button');
    copyJsonButton.type = 'button';
    copyJsonButton.className = 'copy-button';
    copyJsonButton.textContent = 'Copiar JSON';

    copyJsonButton.addEventListener('click', () => {
      copyText(json, copyJsonButton);
    });

    details.append(pre, copyJsonButton);
  }

  urlCell.append(details);
});