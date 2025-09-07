import { listarChamados, obterChamadoPorId, criarChamado, atualizarChamado, excluirChamado, listarChamadosPorTecnico } from '../models/chamado.js';
import { listarApontamentos } from '../models/apontamento.js';
import notificationService from '../services/notificationService.js';

const chamadoController = {

  async atribuirTecnico(req, res) {
    try {
      const { id } = req.params;
      const { tecnico_id } = req.body;

      if (!tecnico_id) {
        return res.status(400).json({ erro: 'ID do técnico é obrigatório.' });
      }

      const chamadoData = {
        tecnico_id: tecnico_id,
        status: 'em andamento'
      };

      await atualizarChamado(id, chamadoData);

      // --- Notificação Adicionada ---
      // Notifica o usuário que o chamado foi iniciado
      const chamado = await obterChamadoPorId(id);
      await notificationService.notificarStatusChamado(chamado);
      
      res.status(200).json({ mensagem: 'Técnico atribuído e chamado iniciado com sucesso.' });
    } catch (error) {
      console.error("Erro ao atribuir técnico:", error);
      res.status(500).json({ erro: 'Erro ao atribuir técnico ao chamado.' });
    }
  },

  async listarChamados(req, res) {
    try {
      const { tecnico_id, usuario_id, status } = req.query;
      const filters = [];
      
      if (tecnico_id) {
        filters.push(`(status = 'pendente' OR status = 'em andamento' OR tecnico_id = ${Number(tecnico_id)})`);
      }
      if (usuario_id) filters.push(`usuario_id = ${Number(usuario_id)}`);
      if (status) filters.push(`status = '${status}'`);
      
      const where = filters.length ? filters.join(' AND ') : null;
      
      const chamados = await listarChamados(where);

      if (!chamados || chamados.length === 0) {
        return res.status(200).json([]);
      }

      const chamadosComApontamentos = await Promise.all(
        chamados.map(async (chamado) => {
          const apontamentos = await listarApontamentos(`chamado_id = ${chamado.id}`);
          return { ...chamado, apontamentos: apontamentos || [] };
        })
      );

      res.status(200).json(chamadosComApontamentos);
    } catch (error) {
      console.error("Erro ao listar chamados:", error);
      res.status(500).json({ erro: 'Erro ao listar chamados' });
    }
  },

  async obterChamadoPorId(req, res) {
    try {
      const chamado = await obterChamadoPorId(req.params.id);
      if (!chamado) {
        return res.status(404).json({ erro: 'Chamado não encontrado' });
      }
      const apontamentos = await listarApontamentos(`chamado_id = ${chamado.id}`);
      const chamadoCompleto = { ...chamado, apontamentos: apontamentos || [] };
      res.status(200).json(chamadoCompleto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao obter chamado' });
    }
  },

  async criarChamado(req, res) {
    try {
      const { titulo, descricao, tipo_id, usuario_id, patrimonio } = req.body;
      if (!titulo || !descricao || !tipo_id || !usuario_id) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando: titulo, descricao, tipo_id, usuario_id' });
      }
      const chamadoData = {
        titulo,
        descricao,
        tipo_id,
        usuario_id,
        patrimonio,
        status: 'pendente'
      };
      const id = await criarChamado(chamadoData);

      // Dispara a notificação de novo chamado
      await notificationService.notificarNovoChamado({ id, ...chamadoData });

      res.status(201).json({ id, mensagem: 'Chamado criado com sucesso' });
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
      res.status(500).json({ erro: 'Erro ao criar chamado' });
    }
  },

  async atualizarChamado(req, res) {
    try {
      const { status } = req.body;
      const chamadoData = { ...req.body };

      if (Object.keys(chamadoData).length === 0) {
        return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização' });
      }

      await atualizarChamado(req.params.id, chamadoData);

      // --- CORREÇÃO DE LÓGICA ---
      // Notifica o usuário ANTES de enviar a resposta.
      if (status) {
        const chamado = await obterChamadoPorId(req.params.id);
        await notificationService.notificarStatusChamado(chamado);
      }
      
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
      const chamadosComApontamentos = await Promise.all(
        chamados.map(async (chamado) => {
          const apontamentos = await listarApontamentos(`chamado_id = ${chamado.id}`);
          return { ...chamado, apontamentos: apontamentos || [] };
        })
      );
      res.status(200).json(chamadosComApontamentos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar chamados por técnico' });
    }
  }
};

export default chamadoController;