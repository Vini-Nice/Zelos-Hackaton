import express from 'express';
import usuarioController from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.obterUsuarioPorId);
router.post('/', usuarioController.criarUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.excluirUsuario);
router.post('/login', usuarioController.login);

export default router;