import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { profileImageDir, profileImageExtension } from '../middlewares/profileImageUpload.js';

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

  // Devuelve el perfil del usuario autenticado.
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select('name email profileImage');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.status(200).json({
        message: 'Perfil del usuario',
        data: { _id: user._id, name: user.name, email: user.email, profileImage: user.profileImage ?? null }
      });
    } catch (error) {
      return next(error);
    }
  }

  // Guarda la foto y actualiza el perfil.
  async uploadProfileImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Enviá una imagen en el campo profileImage' });
      }

      const extension = profileImageExtension(req.file.buffer);
      if (!extension) {
        return res.status(400).json({ message: 'Usá una imagen JPEG, PNG o WebP' });
      }

      const filename = `${randomUUID()}.${extension}`;
      const path = join(profileImageDir, filename);
      const profileImage = `/uploads/profiles/${filename}`;
      await mkdir(profileImageDir, { recursive: true });
      await writeFile(path, req.file.buffer, { flag: 'wx' });

      let user;
      try {
        user = await User.findByIdAndUpdate(
          req.user._id, { profileImage }, { new: false }
        ).select('name email profileImage');
      } catch (error) {
        await unlink(path).catch(() => {});
        throw error;
      }
      if (!user) {
        await unlink(path);
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const previous = user.profileImage?.match(/^\/uploads\/profiles\/([0-9a-f-]{36}\.(?:jpg|png|webp))$/i);
      if (previous) await unlink(join(profileImageDir, previous[1])).catch(() => {});

      return res.status(200).json({
        message: 'Foto de perfil actualizada',
        data: { _id: user._id, name: user.name, email: user.email, profileImage }
      });
    } catch (error) {
      return next(error);
    }
  }

  // Inicia sesión y emite un token.
  async login(req, res, next) {
    try {
      const { email, password } = req.body ?? {};
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

      if (!normalizedEmail || typeof password !== 'string' || !password ||
          Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(400).json({ message: 'Ingresá un email y una contraseña válidos' });
      }

      const user = await User.findOne({ email: normalizedEmail });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const secret = process.env.SECRET_KEY;
      if (!secret?.trim()) {
        return next(new Error('Falta configurar SECRET_KEY'));
      }

      const token = jwt.sign(
        { _id: user._id, name: user.name, role: user.role ?? 'user' },
        secret,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: 'Sesión iniciada', token });
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthController;
