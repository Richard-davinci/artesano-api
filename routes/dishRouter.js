import express from 'express';
import DishController from '../controllers/DishController.js';

const router = express.Router();
const controller = new DishController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;