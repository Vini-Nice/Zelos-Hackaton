import { listarPoolTecnicos, obterPoolTecnicoPorId, criarPoolTecnico, atualizarPoolTecnico, excluirPoolTecnico } from '../models/pool_tecnico.js';

const poolTecnicoController = {
  async listarPoolTecnicos(req, res) {
    try {
      const poolTecnicos = await listarPoolTecnicos();
      res.status(200).json(poolTecnicos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar pool_tecnico' });
    }
  },

  async obterPoolTecnicoPorId(req, res) {
    try {
      const poolTecnico = await obterPoolTecnicoPorId(req.params.id);
      if (!poolTecnico) {
        return res.status(404).json({ erro: 'Pool_tecnico não encontrado' });
      }
      res.status(200).json(poolTecnico);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao obter pool_tecnico' });
    }
  },

  async criarPoolTecnico(req, res) {
    try {
      const { id_pool, id_tecnico } = req.body;
      if (!id_pool || !id_tecnico) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando: id_pool, id_tecnico' });
      }
      const poolTecnicoData = { id_pool, id_tecnico };
      const id = await criarPoolTecnico(poolTecnicoData);
      res.status(201).json({ id, mensagem: 'Pool_tecnico criado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar pool_tecnico' });
    }
  },

  async atualizarPoolTecnico(req, res) {
    try {
      const { id_pool, id_tecnico } = req.body;
      const poolTecnicoData = {};
      if (id_pool) poolTecnicoData.id_pool = id_pool;
      if (id_tecnico) poolTecnicoData.id_tecnico = id_tecnico;

      if (Object.keys(poolTecnicoData).length === 0) {
        return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização' });
      }
      await atualizarPoolTecnico(req.params.id, poolTecnicoData);
      res.status(200).json({ mensagem: 'Pool_tecnico atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar pool_tecnico' });
    }
  },

  async excluirPoolTecnico(req, res) {
    try {
      await excluirPoolTecnico(req.params.id);
      res.status(200).json({ mensagem: 'Pool_tecnico excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao excluir pool_tecnico' });
    }
  }
};

export default poolTecnicoController;