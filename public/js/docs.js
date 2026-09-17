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

  // Los GET solo necesitan el botón de copiar.
  if (!['POST', 'PUT', 'DELETE'].includes(method)) {
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

  if (method === 'POST' && isCategory) {
    instructions.textContent =
      'Seleccioná POST y Body → JSON. Esperado: 201. '
      + 'Copiá el data._id de la respuesta para consultar, '
      + 'actualizar y eliminar esta categoría de prueba.';

    body = categoryExample;

  } else if (method === 'POST') {
    instructions.textContent =
      'Seleccioná POST y Body → JSON. Esperado: 201. '
      + 'Copiá el data._id para probar PUT y DELETE. '
      + 'El campo category debe contener el ID de una categoría existente.';

    body = dishExample;

  } else if (method === 'PUT' && isCategory) {
    instructions.textContent =
      'Seleccioná PUT y reemplazá :id por el ID de la categoría '
      + 'de prueba. En Body → JSON enviá nombre y descripción. '
      + 'Esperado: 200 y los datos actualizados.';

    body = {
      name: 'Categoría de prueba actualizada',
      description: 'Descripción modificada desde Thunder Client'
    };

  } else if (method === 'PUT') {
    instructions.textContent =
      'Seleccioná PUT y reemplazá :id por el ID del plato de prueba. '
      + 'Elegí Body → JSON y enviá los cinco campos. '
      + 'Esperado: 200. Usá una categoría existente.';

    body = updateExample;

  } else if (method === 'DELETE' && isCategory) {
    instructions.textContent =
      'Seleccioná DELETE y reemplazá :id por el ID de la categoría '
      + 'de prueba. Dejá Body vacío. Si no tiene platos, esperado: 200. '
      + 'Si tiene platos asociados, esperado: 400 y el borrado se bloquea.';

  } else if (method === 'DELETE') {
    instructions.textContent =
      'Seleccioná DELETE y reemplazá :id por el ID del plato '
      + 'de prueba. Dejá Body vacío. Esperado: 200. '
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