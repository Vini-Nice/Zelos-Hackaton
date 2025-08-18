import express from 'express';
import poolTecnicoController from '../controllers/poolTecnicoController.js';

const router = express.Router();

router.get('/', poolTecnicoController.listarPoolTecnicos);
router.get('/:id', poolTecnicoController.obterPoolTecnicoPorId);
router.post('/', poolTecnicoController.criarPoolTecnico);
router.put('/:id', poolTecnicoController.atualizarPoolTecnico);
router.delete('/:id', poolTecnicoController.excluirPoolTecnico);

export default router;