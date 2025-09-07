import express from 'express';
import supportChatController from '../controllers/supportChatController.js';

const router = express.Router();

// Rota para o admin pegar a lista de todos os usuários
router.get('/users', supportChatController.getAllUsers);

// Rota para pegar as conversas de um usuário
router.get('/conversations/:userId', supportChatController.getConversations);

// Rota para pegar as mensagens de uma conversa
router.get('/messages/:conversationId', supportChatController.getMessages);

// Rota para enviar uma mensagem
router.post('/messages', supportChatController.sendMessage);

export default router;