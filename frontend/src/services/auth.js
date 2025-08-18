import { apiService } from './api';

export const authService = {
  async login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return apiService.postForm('/auth/login', formData);
  },
  
  async logout() {
    return apiService.post('/auth/logout');
  },
  
  async checkAuth() {
    return apiService.get('/auth/check-auth');
  },

  // Verificar se o usuário está autenticado
  isAuthenticated() {
    // Verificar se existe cookie de sessão
    return document.cookie.includes('connect.sid');
  }
};
