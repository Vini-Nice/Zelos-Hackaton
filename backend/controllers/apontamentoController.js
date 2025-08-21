import { listarApontamentos, obterApontamentoPorId, criarApontamento, atualizarApontamento, excluirApontamento } from '../models/apontamento.js';

const apontamentoController = {
  async listarApontamentos(req, res) {
    try {
      const apontamentos = await listarApontamentos();
      res.status(200).json(apontamentos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar apontamentos' });
    }
  },

  async obterApontamentoPorId(req, res) {
    try {
      const apontamento = await obterApontamentoPorId(req.params.id);
      if (!apontamento) {
        return res.status(404).json({ erro: 'Apontamento não encontrado' });
      }
      res.status(200).json(apontamento);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao obter apontamento' });
    }
  },

  async criarApontamento(req, res) {
    try {
      const { chamado_id, tecnico_id, descricao, comeco, fim } = req.body;
      if (!chamado_id || !tecnico_id || !comeco) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando: chamado_id, tecnico_id, comeco' });
      }
      const apontamentoData = { 
        chamado_id, 
        tecnico_id, 
        descricao: descricao || null, 
        comeco, 
        fim: fim || null 
      };
      const id = await criarApontamento(apontamentoData);
      res.status(201).json({ id, mensagem: 'Apontamento criado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar apontamento' });
    }
  },

  async atualizarApontamento(req, res) {
    try {
      const { chamado_id, tecnico_id, descricao, comeco, fim } = req.body;
      const apontamentoData = {};
      if (chamado_id) apontamentoData.chamado_id = chamado_id;
      if (tecnico_id) apontamentoData.tecnico_id = tecnico_id;
      if (descricao) apontamentoData.descricao = descricao;
      if (comeco) apontamentoData.comeco = comeco;
      if (fim) apontamentoData.fim = fim;

      if (Object.keys(apontamentoData).length === 0) {
        return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização' });
      }
      await atualizarApontamento(req.params.id, apontamentoData);
      res.status(200).json({ mensagem: 'Apontamento atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar apontamento' });
    }
  },

  async excluirApontamento(req, res) {
    try {
      await excluirApontamento(req.params.id);
      res.status(200).json({ mensagem: 'Apontamento excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao excluir apontamento' });
    }
  }
};

export default apontamentoController;