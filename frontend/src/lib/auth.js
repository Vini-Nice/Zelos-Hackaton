// Sistema de autenticação local usando localStorage
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const auth = {
  // Verifica se o usuário está logado
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Obtém o usuário logado
  getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obtém o token de autenticação
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  // Faz login do usuário
  async login(email, senha) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || 'Erro no login');
      }

      const data = await response.json();
      
      // Salva no localStorage
      localStorage.setItem('authToken', 'local-token'); // Token simplificado
      localStorage.setItem('user', JSON.stringify(data.usuario));
      
      return data.usuario;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Faz logout do usuário
  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Verifica se o usuário tem permissão de admin
  isAdmin() {
    const user = this.getUser();
    return user?.funcao === 'admin';
  },

  // Verifica se o usuário é técnico
  isTecnico() {
    const user = this.getUser();
    return user?.funcao === 'tecnico';
  }
};

// Função para fazer requisições autenticadas
export const apiRequest = async (endpoint, options = {}) => {
  const token = auth.getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Erro na requisição');
  }

  return response.json();
};
