import { getMessagesByChamadoId, createMessage } from '../models/chatMessage.js';
import notificationService from '../services/notificationService.js';

const chatMessageController = {
  async getMessages(req, res) {
    try {
      const { chamadoId } = req.params;
      const messages = await getMessagesByChamadoId(chamadoId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar mensagens' });
    }
  },

  async sendMessage(req, res) {
    try {
      const { chamado_id, sender_id, receiver_id, message } = req.body;
      if (!chamado_id || !sender_id || !receiver_id || !message) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
      }
      const messageData = { chamado_id, sender_id, receiver_id, message };
      const id = await createMessage(messageData);
      // Dispara a notificação de nova mensagem
      await notificationService.notificarNovaMensagem(messageData);
      res.status(201).json({ id, mensagem: 'Mensagem enviada com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao enviar mensagem' });
    }
  }
};

export default chatMessageController;