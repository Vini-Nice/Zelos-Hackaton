import { create, readAll, update } from '../config/database.js';

const getMessagesByChamadoId = async (chamado_id) => {
  try {
    return await readAll('chat_messages', `chamado_id = ${chamado_id} ORDER BY timestamp ASC`);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw error;
  }
};

const createMessage = async (messageData) => {
  try {
    return await create('chat_messages', messageData);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    throw error;
  }
};

export { getMessagesByChamadoId, createMessage };