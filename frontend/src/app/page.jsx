"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { chamadosService } from "../services/chamados";
import Link from "next/link";
import { FileText, Clock, CheckCircle, HelpCircle, AlertTriangle, User, TrendingUp } from "lucide-react";

const acoes = [
  { label: "Abrir Chamado", link: "/abrir-chamado", icon: <FileText className="h-10 w-10 text-blue-600" /> },
  { label: "Meus Chamados", link: "/meus-chamados", icon: <Clock className="h-10 w-10 text-purple-600" /> },
  { label: "Manual / FAQ", link: "/manual", icon: <HelpCircle className="h-10 w-10 text-green-600" /> },
];

const statusColors = {
  "Em Aberto": "bg-yellow-100 text-yellow-800",
  "Resolvido": "bg-green-100 text-green-800",
  "Em andamento": "bg-blue-100 text-blue-800",
  "Pendente": "bg-orange-100 text-orange-800",
  "Cancelado": "bg-red-100 text-red-800",
};

export default function DashboardUsuario() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    abertos: 0,
    resolvidos: 0,
    pendentes: 0
  });

  useEffect(() => {
    if (user) {
      carregarChamados();
    }
  }, [user]);

  const carregarChamados = async () => {
    try {
      setLoading(true);
      // Aqui você pode implementar a busca por usuário específico
      const response = await chamadosService.listarChamados();
      setChamados(response.slice(0, 5)); // Mostra apenas os 5 mais recentes
      
      // Calcular estatísticas
      const abertos = response.filter(c => c.status === 'Em Aberto').length;
      const resolvidos = response.filter(c => c.status === 'Resolvido').length;
      const pendentes = response.filter(c => c.status === 'Pendente' || c.status === 'Em andamento').length;
      
      setStats({ abertos, resolvidos, pendentes });
    } catch (error) {
      console.error('Erro ao carregar chamados:', error);
      // Em caso de erro, usar dados mockados
      setChamados([
        { id: 1, titulo: "Problema no login", data: "14/08/2025", status: "Em Aberto", prioridade: "Alta" },
        { id: 2, titulo: "Erro na impressora", data: "13/08/2025", status: "Resolvido", prioridade: "Média" },
        { id: 3, titulo: "Falha no sistema interno", data: "12/08/2025", status: "Em andamento", prioridade: "Alta" },
      ]);
      setStats({ abertos: 1, resolvidos: 1, pendentes: 1 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header com perfil */}
          <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Olá, {user?.displayName || user?.username || 'Usuário'}!
              </h1>
              <p className="text-gray-600">Aqui está o resumo da sua conta e chamados.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 rounded-full p-2">
                <User className="h-8 w-8 text-gray-700" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {acoes.map(({ label, link, icon }) => (
                <Link
                  key={label}
                  href={link}
                  className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center gap-3 border hover:shadow-md transition hover:scale-[1.02]"
                >
                  {icon}
                  <span className="font-semibold text-gray-900">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Estatísticas do usuário */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo Rápido</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <p className="text-4xl font-bold text-blue-600">{stats.abertos}</p>
                <p className="text-gray-600">Chamados Abertos</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <p className="text-4xl font-bold text-green-600">{stats.resolvidos}</p>
                <p className="text-gray-600">Chamados Resolvidos</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <p className="text-4xl font-bold text-yellow-600">{stats.pendentes}</p>
                <p className="text-gray-600">Pendentes de Resposta</p>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Tendência de Chamados</h2>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-500">Gráfico de tendência</p>
                <p className="text-sm text-gray-400">Integração com biblioteca de gráficos</p>
              </div>
            </div>
          </div>

          {/* Meus chamados */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Meus Chamados Recentes</h2>
              <Link 
                href="/meus-chamados"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ver todos →
              </Link>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Carregando chamados...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="py-2 px-4">Título</th>
                      <th className="py-2 px-4">Data</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Prioridade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chamados.length > 0 ? (
                      chamados.map((chamado, i) => (
                        <tr
                          key={chamado.id || i}
                          className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                        >
                          <td className="py-2 px-4">{chamado.titulo}</td>
                          <td className="py-2 px-4">{chamado.data}</td>
                          <td className="py-2 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[chamado.status] || 'bg-gray-100 text-gray-800'}`}
                            >
                              {chamado.status}
                            </span>
                          </td>
                          <td className="py-2 px-4">{chamado.prioridade}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">
                          Nenhum chamado encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mensagens e alertas */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Avisos Importantes</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <AlertTriangle className="text-yellow-600" />
                <p className="text-gray-700">O sistema passará por manutenção no dia 20/08/2025, das 02h às 05h.</p>
              </div>
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <CheckCircle className="text-blue-600" />
                <p className="text-gray-700">Seu chamado "Erro na impressora" foi resolvido. Obrigado pela paciência!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
