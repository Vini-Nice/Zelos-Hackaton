import { apiService } from './api';

export const authLocalService = {
  async login(email, senha) {
    return await apiService.post('/api/usuarios/login', { email, senha });
  },
  async logout() {
    // Se houver rota de logout real, implemente aqui
    // Por enquanto, apenas remove o token local
    localStorage.removeItem('token');
  },
  async checkAuth() {
    // Não há rota de sessão, então apenas verifica se há token
    const token = localStorage.getItem('token');
    return { authenticated: !!token };
  }
};
