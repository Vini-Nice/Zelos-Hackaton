import express from 'express';
import relatoriosController from '../controllers/relatoriosController.js';

const router = express.Router();

router.get('/chamados', relatoriosController.gerarRelatorioChamados);

export default router;