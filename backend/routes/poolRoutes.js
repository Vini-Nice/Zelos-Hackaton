import express from 'express';
import poolController from '../controllers/poolController.js';

const router = express.Router();

router.get('/', poolController.listarPools);
router.get('/:id', poolController.obterPoolPorId);
router.post('/', poolController.criarPool);
router.put('/:id', poolController.atualizarPool);
router.delete('/:id', poolController.excluirPool);

export default router;