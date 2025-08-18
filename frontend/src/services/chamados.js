import { apiService } from './api';

export const chamadosService = {
  // Listar todos os chamados
  async listarChamados() {
    return apiService.get('/api/chamados');
  },

  // Obter chamado por ID
  async obterChamado(id) {
    return apiService.get(`/api/chamados/${id}`);
  },

  // Criar novo chamado
  async criarChamado(dados) {
    return apiService.post('/api/chamados', dados);
  },

  // Atualizar chamado
  async atualizarChamado(id, dados) {
    return apiService.put(`/api/chamados/${id}`, dados);
  },

  // Excluir chamado
  async excluirChamado(id) {
    return apiService.delete(`/api/chamados/${id}`);
  },

  // Listar chamados por usuário
  async listarChamadosPorUsuario(usuarioId) {
    return apiService.get(`/api/chamados/usuario/${usuarioId}`);
  },

  // Atualizar status do chamado
  async atualizarStatus(id, status) {
    return apiService.put(`/api/chamados/${id}/status`, { status });
  },

  // Adicionar comentário ao chamado
  async adicionarComentario(id, comentario) {
    return apiService.post(`/api/chamados/${id}/comentarios`, { comentario });
  }
};
