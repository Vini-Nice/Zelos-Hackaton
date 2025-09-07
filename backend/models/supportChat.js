import { create, readAll, read } from '../config/database.js';

// Encontra ou cria uma conversa entre dois usuários
const findOrCreateConversation = async (user1_id, user2_id) => {
  const [u1, u2] = [user1_id, user2_id].sort(); // Garante a ordem para a chave única
  let conversation = await read('support_conversations', `user1_id = ${u1} AND user2_id = ${u2}`);
  if (!conversation) {
    const conversationId = await create('support_conversations', { user1_id: u1, user2_id: u2 });
    conversation = { id: conversationId, user1_id: u1, user2_id: u2 };
  }
  return conversation;
};

// Busca todas as conversas de um usuário
const getConversationsByUserId = async (userId) => {
  try {
    return await readAll('support_conversations', `user1_id = ${userId} OR user2_id = ${userId}`);
  } catch (error) {
    throw error;
  }
};

// Busca todas as mensagens de uma conversa
const getMessagesByConversationId = async (conversationId) => {
    try {
        return await readAll('support_messages', `conversation_id = ${conversationId} ORDER BY timestamp ASC`);
    } catch (error) {
        throw error;
    }
};

// Cria uma nova mensagem
const createMessage = async (messageData) => {
    try {
        return await create('support_messages', messageData);
    } catch (error) {
        throw error;
    }
};

export { findOrCreateConversation, getConversationsByUserId, getMessagesByConversationId, createMessage };