import express from 'express';
const router = express.Router();
import { create, readAll, update, deleteRecord } from '../config/database.js';

// Buscar notificações de um usuário
router.get('/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const notificacoes = await readAll('notificacoes', `usuario_id = ${usuarioId} ORDER BY criado_em DESC`);
    res.json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Marcar notificação como lida
router.put('/:id/ler', async (req, res) => {
  try {
    const { id } = req.params;
    await update('notificacoes', { lida: true }, `id = ${id}`);
    res.json({ success: true, message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Marcar todas as notificações de um usuário como lidas
router.put('/:usuarioId/ler-todas', async (req, res) => {
    try {
        const { usuarioId } = req.params;
        await update('notificacoes', { lida: true }, `usuario_id = ${usuarioId}`);
        res.json({ success: true, message: 'Todas as notificações foram marcadas como lidas.' });
    } catch (error) {
        console.error('Erro ao marcar todas as notificações como lidas:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Deletar uma notificação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRecord('notificacoes', `id = ${id}`);
    res.json({ success: true, message: 'Notificação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar uma nova notificação
router.post('/', async (req, res) => {
  try {
    const { usuario_id, tipo, titulo, mensagem, dados_adicional } = req.body;
    const novaNotificacao = {
      usuario_id,
      tipo,
      titulo,
      mensagem,
      dados_adicional: JSON.stringify(dados_adicional)
    };
    const id = await create('notificacoes', novaNotificacao);
    res.status(201).json({ success: true, message: 'Notificação criada com sucesso', id });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Contar notificações não lidas de um usuário
router.get('/:usuarioId/nao-lidas', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const notificacoes = await readAll('notificacoes', `usuario_id = ${usuarioId} AND lida = FALSE`);
    res.json({ count: notificacoes.length });
  } catch (error) {
    console.error('Erro ao contar notificações não lidas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;