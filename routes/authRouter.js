import express from 'express';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import profileImageUpload from '../middlewares/profileImageUpload.js';

const router = express.Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authMiddleware, controller.getMe);
router.post('/profileimage', authMiddleware, profileImageUpload, controller.uploadProfileImage);

export default router;
