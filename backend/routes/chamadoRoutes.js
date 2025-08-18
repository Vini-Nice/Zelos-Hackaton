import express from 'express';
import chamadoController from '../controllers/chamadoController.js';

const router = express.Router();

router.get('/', chamadoController.listarChamados);
router.get('/:id', chamadoController.obterChamadoPorId);
router.post('/', chamadoController.criarChamado);
router.put('/:id', chamadoController.atualizarChamado);
router.delete('/:id', chamadoController.excluirChamado);
router.get('/tecnico/:tecnico_id', chamadoController.listarChamadosPorTecnico);

export default router;