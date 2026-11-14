import jwt from 'jsonwebtoken';

// Verifica el token de la solicitud.
function authMiddleware(req, res, next) {
  const header = req.get('authorization');
  const match = header?.match(/^Bearer ([^\s]+)$/i);
  if (!match) {
    return res.status(401).json({ message: 'Token Bearer requerido' });
  }

  const secret = process.env.SECRET_KEY;
  if (!secret?.trim()) {
    return next(new Error('Falta configurar SECRET_KEY'));
  }

  try {
    req.user = jwt.verify(match[1], secret, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ message: 'Token inválido o vencido' });
  }

  return next();
}

export default authMiddleware;
