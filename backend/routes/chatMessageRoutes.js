import express from 'express';
import chatMessageController from '../controllers/chatMessageController.js';

const router = express.Router();

router.get('/:chamadoId', chatMessageController.getMessages);
router.post('/', chatMessageController.sendMessage);

export default router;