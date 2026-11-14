export const notFound = (req, res) => {
  return res.status(404).json({
    message: 'Ruta de la API no encontrada'
  });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'El cuerpo de la solicitud contiene un JSON inválido'
    });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'El cuerpo de la solicitud supera el tamaño permitido'
    });
  }

  console.error(error);

  const status = Number.isInteger(error.status) &&
  error.status >= 400 &&
  error.status < 500
    ? error.status
    : 500;

  return res.status(status).json({
    message: status === 500
      ? 'Error interno del servidor'
      : 'No se pudo procesar la solicitud'
  });
};