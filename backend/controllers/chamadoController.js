import { listarChamados, obterChamadoPorId, criarChamado, atualizarChamado, excluirChamado, listarChamadosPorTecnico } from '../models/chamado.js';

const chamadoController = {
  async listarChamados(req, res) {
    try {
      const { tecnico_id, usuario_id, status } = req.query;
      const filters = [];
      
      // Se for um técnico, mostrar todos os chamados pendentes e em andamento
      if (tecnico_id) {
        filters.push(`(status = 'pendente' OR status = 'em andamento' OR tecnico_id = ${Number(tecnico_id)})`);
      }
      
      if (usuario_id) filters.push(`usuario_id = ${Number(usuario_id)}`);
      if (status) filters.push(`status = '${status}'`);
      
      const where = filters.length ? filters.join(' AND ') : null;
      const chamados = await listarChamados(where);
      res.status(200).json(chamados);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar chamados' });
    }
  },

  async obterChamadoPorId(req, res) {
    try {
      const chamado = await obterChamadoPorId(req.params.id);
      if (!chamado) {
        return res.status(404).json({ erro: 'Chamado não encontrado' });
      }
      res.status(200).json(chamado);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao obter chamado' });
    }
  },

  async criarChamado(req, res) {
    try {
      const { titulo, descricao, tipo_id, usuario_id, tecnico_id, status } = req.body;
      if (!titulo || !descricao || !tipo_id || !usuario_id) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando: titulo, descricao, tipo_id, usuario_id' });
      }
      const chamadoData = { 
        titulo, 
        descricao, 
        tipo_id, 
        usuario_id, 
        tecnico_id: tecnico_id || null, 
        status: status || 'pendente' 
      };
      const id = await criarChamado(chamadoData);
      res.status(201).json({ id, mensagem: 'Chamado criado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar chamado' });
    }
  },

  async atualizarChamado(req, res) {
    try {
      const { titulo, descricao, tipo_id, usuario_id, tecnico_id, status } = req.body;
      const chamadoData = {};
      if (titulo) chamadoData.titulo = titulo;
      if (descricao) chamadoData.descricao = descricao;
      if (tipo_id) chamadoData.tipo_id = tipo_id;
      if (usuario_id) chamadoData.usuario_id = usuario_id;
      if (tecnico_id) chamadoData.tecnico_id = tecnico_id;
      if (status) chamadoData.status = status;

      if (Object.keys(chamadoData).length === 0) {
        return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização' });
      }
      await atualizarChamado(req.params.id, chamadoData);
      res.status(200).json({ mensagem: 'Chamado atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar chamado' });
    }
  },

  async excluirChamado(req, res) {
    try {
      await excluirChamado(req.params.id);
      res.status(200).json({ mensagem: 'Chamado excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao excluir chamado' });
    }
  },

  async listarChamadosPorTecnico(req, res) {
    try {
      const chamados = await listarChamadosPorTecnico(req.params.tecnico_id);
      res.status(200).json(chamados);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar chamados por técnico' });
    }
  }
};

export default chamadoController;