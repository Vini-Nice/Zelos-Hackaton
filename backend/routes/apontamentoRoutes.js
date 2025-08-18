import express from 'express';
import apontamentoController from '../controllers/apontamentoController.js';

const router = express.Router();

router.get('/', apontamentoController.listarApontamentos);
router.get('/:id', apontamentoController.obterApontamentoPorId);
router.post('/', apontamentoController.criarApontamento);
router.put('/:id', apontamentoController.atualizarApontamento);
router.delete('/:id', apontamentoController.excluirApontamento);

export default router;