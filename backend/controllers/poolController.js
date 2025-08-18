import { listarPools, obterPoolPorId, criarPool, atualizarPool, excluirPool } from '../models/pool.js';

const poolController = {
  async listarPools(req, res) {
    try {
      const pools = await listarPools();
      res.status(200).json(pools);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar pools' });
    }
  },

  async obterPoolPorId(req, res) {
    try {
      const pool = await obterPoolPorId(req.params.id);
      if (!pool) {
        return res.status(404).json({ erro: 'Pool não encontrado' });
      }
      res.status(200).json(pool);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao obter pool' });
    }
  },

  async criarPool(req, res) {
    try {
      const { titulo, descricao, status, created_by, updated_by } = req.body;
      if (!titulo || !created_by || !updated_by) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando: titulo, created_by, updated_by' });
      }
      const poolData = { 
        titulo, 
        descricao: descricao || null, 
        status: status || 'ativo', 
        created_by, 
        updated_by 
      };
      const id = await criarPool(poolData);
      res.status(201).json({ id, mensagem: 'Pool criado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar pool' });
    }
  },

  async atualizarPool(req, res) {
    try {
      const { titulo, descricao, status, updated_by } = req.body;
      const poolData = {};
      if (titulo) poolData.titulo = titulo;
      if (descricao) poolData.descricao = descricao;
      if (status) poolData.status = status;
      if (updated_by) poolData.updated_by = updated_by;

      if (Object.keys(poolData).length === 0) {
        return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização' });
      }
      await atualizarPool(req.params.id, poolData);
      res.status(200).json({ mensagem: 'Pool atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar pool' });
    }
  },

  async excluirPool(req, res) {
    try {
      await excluirPool(req.params.id);
      res.status(200).json({ mensagem: 'Pool excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao excluir pool' });
    }
  }
};

export default poolController;