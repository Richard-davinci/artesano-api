import express from 'express';
import CategoryController from '../controllers/CategoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();
const controller = new CategoryController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authMiddleware, roleMiddleware, controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
