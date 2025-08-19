"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { authLocalService } from "../../services/authLocal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    carregarUsuariosTeste();
  }, []);

  // Limpar erro quando o usuário digitar
  useEffect(() => {
    if (email || senha) {
      clearError();
    }
  }, [email, senha, clearError]);

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
    
    if (!email.trim() || !senha.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await login(email, senha);
      // O redirecionamento será feito pelo useEffect acima
    } catch (error) {
      // O erro já está sendo tratado no contexto
      console.error('Erro no login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const preencherCredenciaisTeste = (username, password) => {
    setEmail(username);
    setSenha(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Zelos</h1>
          <p className="text-gray-600">Sistema de Chamados</p>
        </div>

        {/* Informações do modo selecionado */}
        {/* Remover todas as referências a authMode, deixar apenas o fluxo local */}
        {/* Lista de usuários de teste */}
        {/* Remover qualquer UI de seleção de modo de autenticação */}
        {/* Lista de usuários de teste */}
        {showUsuariosTeste && (
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o email de teste"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Use 'password' para usuários de teste"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !email.trim() || !senha.trim()}
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
            Modo desenvolvimento - Use credenciais de teste
          </p>
        </div>
      </div>
    </div>
  );
}
