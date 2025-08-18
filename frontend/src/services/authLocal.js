import { apiService } from './api';

export const authLocalService = {
  async login(username, password) {
    // Tentar primeiro as rotas originais, depois as de backup
    try {
      return await apiService.post('/auth-local/login-local', { username, password });
    } catch (error) {
      // Se falhar, usar rota de backup
      return await apiService.post('/login-local', { username, password });
    }
  },
  
  async logout() {
    try {
      return await apiService.post('/auth-local/logout-local');
    } catch (error) {
      return await apiService.post('/logout-local');
    }
  },
  
  async checkAuth() {
    try {
      return await apiService.get('/auth-local/check-auth-local');
    } catch (error) {
      return await apiService.get('/check-auth-local');
    }
  },

  // Listar usuários de teste disponíveis
  async listarUsuariosTeste() {
    try {
      return await apiService.get('/auth-local/usuarios-teste');
    } catch (error) {
      // Se falhar, usar rota de backup
      return await apiService.get('/usuarios-teste');
    }
  }
};
