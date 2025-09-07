import { findOrCreateConversation, getConversationsByUserId, getMessagesByConversationId, createMessage } from '../models/supportChat.js';
import { listarUsuarios } from '../models/usuario.js';

const supportChatController = {
  // Para o admin buscar todos os usuários e iniciar um chat
  async getAllUsers(req, res) {
    try {
      const users = await listarUsuarios();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar usuários.' });
    }
  },

  // Para o admin ou usuário buscar suas conversas
  async getConversations(req, res) {
    try {
      const { userId } = req.params;
      const conversations = await getConversationsByUserId(userId);
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar conversas.' });
    }
  },

  // Para buscar as mensagens de uma conversa específica
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const messages = await getMessagesByConversationId(conversationId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar mensagens.' });
    }
  },

  // Para enviar uma mensagem
  async sendMessage(req, res) {
    try {
        const { sender_id, receiver_id, message } = req.body;
        if (!sender_id || !receiver_id || !message) {
            return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
        }
        
        const conversation = await findOrCreateConversation(sender_id, receiver_id);
        
        const messageData = {
            conversation_id: conversation.id,
            sender_id,
            message
        };

        const messageId = await createMessage(messageData);
        res.status(201).json({ id: messageId, message: 'Mensagem enviada.' });

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao enviar mensagem.' });
    }
  }
};

export default supportChatController;