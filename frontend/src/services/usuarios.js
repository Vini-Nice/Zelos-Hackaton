import { apiService } from './api';

export const usuariosService = {
  // Listar todos os usuários
  async listarUsuarios() {
    return apiService.get('/api/usuarios');
  },

  // Obter usuário por ID
  async obterUsuario(id) {
    return apiService.get(`/api/usuarios/${id}`);
  },

  // Obter usuário por email
  async obterUsuarioPorEmail(email) {
    return apiService.get(`/api/usuarios/email/${email}`);
  },

  // Criar novo usuário
  async criarUsuario(dados) {
    return apiService.post('/api/usuarios', dados);
  },

  // Atualizar usuário
  async atualizarUsuario(id, dados) {
    return apiService.put(`/api/usuarios/${id}`, dados);
  },

  // Excluir usuário
  async excluirUsuario(id) {
    return apiService.delete(`/api/usuarios/${id}`);
  },

  // Alterar senha
  async alterarSenha(id, senhaAtual, novaSenha) {
    return apiService.put(`/api/usuarios/${id}/senha`, {
      senhaAtual,
      novaSenha
    });
  },

  // Atualizar perfil do usuário
  async atualizarPerfil(id, dados) {
    return apiService.put(`/api/usuarios/${id}/perfil`, dados);
  }
};
