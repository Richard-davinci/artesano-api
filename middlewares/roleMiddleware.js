// Permite el acceso solo a administradores.
function roleMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  return next();
}

export default roleMiddleware;
