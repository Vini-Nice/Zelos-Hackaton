"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { authLocalService } from "../../services/authLocal";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState('ldap'); // 'ldap' ou 'local'
  const [usuariosTeste, setUsuariosTeste] = useState([]);
  const [showUsuariosTeste, setShowUsuariosTeste] = useState(false);
  
  const { login, user, error, clearError } = useAuth();
  const router = useRouter();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Carregar usuários de teste
  useEffect(() => {
    if (authMode === 'local') {
      carregarUsuariosTeste();
    }
  }, [authMode]);

  // Limpar erro quando o usuário digitar
  useEffect(() => {
    if (username || password) {
      clearError();
    }
  }, [username, password, clearError]);

  const carregarUsuariosTeste = async () => {
    try {
      const response = await authLocalService.listarUsuariosTeste();
      setUsuariosTeste(response.usuarios);
    } catch (error) {
      console.error('Erro ao carregar usuários de teste:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (authMode === 'local') {
        // Login local para desenvolvimento
        const response = await authLocalService.login(username, password);
        // Simular login no contexto
        login(username, password);
      } else {
        // Login LDAP normal
        await login(username, password);
      }
      // O redirecionamento será feito pelo useEffect acima
    } catch (error) {
      // O erro já está sendo tratado no contexto
      console.error('Erro no login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const preencherCredenciaisTeste = (username, password) => {
    setUsername(username);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Zelos</h1>
          <p className="text-gray-600">Sistema de Chamados</p>
        </div>

        {/* Seletor de modo de autenticação */}
        <div className="mb-6">
          <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
            <button
              onClick={() => setAuthMode('ldap')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                authMode === 'ldap'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              LDAP
            </button>
            <button
              onClick={() => setAuthMode('local')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                authMode === 'local'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Desenvolvimento
            </button>
          </div>
        </div>

        {/* Informações do modo selecionado */}
        {authMode === 'local' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Modo Desenvolvimento</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Use credenciais de teste para desenvolvimento. Senha padrão: <strong>password</strong>
                </p>
                <button
                  onClick={() => setShowUsuariosTeste(!showUsuariosTeste)}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium mt-2"
                >
                  {showUsuariosTeste ? 'Ocultar' : 'Ver'} usuários de teste
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de usuários de teste */}
        {showUsuariosTeste && authMode === 'local' && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Usuários de Teste:</h4>
            <div className="space-y-2">
              {usuariosTeste.map((usuario) => (
                <div key={usuario.username} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{usuario.displayName}</p>
                    <p className="text-xs text-gray-500">{usuario.username} • {usuario.funcao}</p>
                  </div>
                  <button
                    onClick={() => preencherCredenciaisTeste(usuario.username, 'password')}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Usar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              {authMode === 'ldap' ? 'Usuário LDAP' : 'Usuário'}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={authMode === 'ldap' ? "Digite seu usuário LDAP" : "Digite o usuário de teste"}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={authMode === 'ldap' ? "Digite sua senha" : "Use 'password' para usuários de teste"}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !username.trim() || !password.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {authMode === 'ldap' 
              ? 'Sistema de autenticação LDAP' 
              : 'Modo desenvolvimento - Use credenciais de teste'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
