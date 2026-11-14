import bcrypt from 'bcrypt';
import User from '../models/User.js';

class AuthController {
  // Registra un usuario.
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body ?? {};

      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'Ingresá tu nombre' });
      }

      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ message: 'Ingresá un email válido' });
      }

      if (typeof password !== 'string' || [...password].length < 8) {
        return res.status(400).json({
          message: 'La contraseña debe tener al menos 8 caracteres'
        });
      }

      // Límite de entrada de bcrypt.
      if (Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(400).json({
          message: 'La contraseña es demasiado larga. Probá acortarla'
        });
      }

      const passwordRequirements =
        'Incluí al menos una minúscula, una mayúscula, un número y un carácter especial';

      // Caracteres permitidos.
      const allowedCharacters = /^[\p{L}\p{M}\x20-\x7E]+$/u;
      const specialCharacter = /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/;
      if (!allowedCharacters.test(password) || /[^\S ]/u.test(password) || /[\u20E3\uFE0E\uFE0F]/u.test(password)) {
        return res.status(400).json({
          message: passwordRequirements
        });
      }

      if (!/\p{Lu}/u.test(password) || !/\p{Ll}/u.test(password) ||
          !/[0-9]/.test(password) || !specialCharacter.test(password)) {
        return res.status(400).json({
          message: passwordRequirements
        });
      }

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ message: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
      });

      return res.status(201).json({
        message: 'Usuario registrado',
        data: { _id: user._id, email: user.email }
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthController;
