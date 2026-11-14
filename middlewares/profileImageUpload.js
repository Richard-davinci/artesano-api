import multer from 'multer';
import { fileURLToPath } from 'node:url';

export const profileImageDir = fileURLToPath(new URL('../uploads/profiles/', import.meta.url));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1, fields: 0 }
}).single('profileImage');

// Recibe una sola imagen de perfil.
export default function profileImageUpload(req, res, next) {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'La imagen no puede superar los 2 MiB' });
      }
      return res.status(400).json({ message: 'Enviá una sola imagen en el campo profileImage' });
    }
    return next(error);
  });
}

// Identifica el formato por la firma del archivo.
export function profileImageExtension(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) return 'png';
  if (buffer.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'))) return 'jpg';
  if (buffer.length >= 16 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP' &&
      ['VP8 ', 'VP8L', 'VP8X'].includes(buffer.toString('ascii', 12, 16))) return 'webp';
  return null;
}
