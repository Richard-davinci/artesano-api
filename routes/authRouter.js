import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();
const controller = new AuthController();

router.post('/register', controller.register);

export default router;
