import { create } from '../config/database.js';

const notificationService = {
  async criarNotificacao(dados) {
    const { usuario_id, tipo, titulo, mensagem, dados_adicional } = dados;
    if (!usuario_id || !tipo || !titulo || !mensagem) {
      console.error("Dados insuficientes para criar notificação.");
      return;
    }

    try {
      await create('notificacoes', {
        usuario_id,
        tipo,
        titulo,
        mensagem,
        dados_adicional: JSON.stringify(dados_adicional || {})
      });
    } catch (error) {
      console.error('Erro ao criar notificação no serviço:', error);
    }
  },

  async notificarNovoChamado(chamado) {
    // Notifica o usuário que abriu o chamado
    this.criarNotificacao({
      usuario_id: chamado.usuario_id,
      tipo: 'chamado',
      titulo: 'Chamado Aberto com Sucesso!',
      mensagem: `Seu chamado "${chamado.titulo}" foi registrado.`,
      dados_adicional: { chamado_id: chamado.id }
    });

    // Você pode adicionar lógicas para notificar administradores ou técnicos aqui
  },

  async notificarStatusChamado(chamado) {
    // Notifica o usuário sobre a mudança de status
    this.criarNotificacao({
      usuario_id: chamado.usuario_id,
      tipo: 'status',
      titulo: `Status do Chamado Atualizado: ${chamado.status}`,
      mensagem: `O status do seu chamado "${chamado.titulo}" foi atualizado.`,
      dados_adicional: { chamado_id: chamado.id }
    });
  },
  
  async notificarNovaMensagem(mensagem) {
    // Notifica o destinatário da mensagem
    this.criarNotificacao({
        usuario_id: mensagem.receiver_id,
        tipo: 'mensagem',
        titulo: 'Nova Mensagem Recebida',
        mensagem: `Você recebeu uma nova mensagem no chamado #${mensagem.chamado_id}.`,
        dados_adicional: { 
            chamado_id: mensagem.chamado_id,
            sender_id: mensagem.sender_id
        }
    });
  }
};

export default notificationService;