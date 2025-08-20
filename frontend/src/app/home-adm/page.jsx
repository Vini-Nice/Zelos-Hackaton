"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Activity,
  UserPlus,
  Wrench,
  Plus,
  ArrowRight
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";

export default function DashboardAdmin() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalChamados: 0,
    chamadosPendentes: 0,
    chamadosResolvidos: 0,
    usuariosAtivos: 0
  });
  const [recentChamados, setRecentChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas
      const [chamadosResponse, usuariosResponse] = await Promise.all([
        apiRequest("/api/chamados"),
        apiRequest("/api/usuarios")
      ]);

      if (chamadosResponse.success && usuariosResponse.success) {
        const chamados = chamadosResponse.data || [];
        const usuarios = usuariosResponse.data || [];

        setStats({
          totalChamados: chamados.length,
          chamadosPendentes: chamados.filter(c => c.status === "pendente").length,
          chamadosResolvidos: chamados.filter(c => c.status === "concluído").length,
          usuariosAtivos: usuarios.length
        });

        // Últimos 5 chamados
        setRecentChamados(chamados.slice(0, 5));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      case "concluído": return "bg-green-100 text-green-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-800";
      case "média": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "em andamento": return "Em Andamento";
      case "concluído": return "Concluído";
      case "cancelado": return "Cancelado";
      default: return status;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Cabeçalho */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Visão geral completa do sistema de chamados</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-500 hidden md:block" />
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-md border p-6 flex items-center hover:shadow-lg transition">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-7 w-7" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChamados}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border p-6 flex items-center hover:shadow-lg transition">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <Clock className="h-7 w-7" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Aberto</p>
                <p className="text-2xl font-bold text-gray-900">{stats.chamadosPendentes}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border p-6 flex items-center hover:shadow-lg transition">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <CheckCircle className="h-7 w-7" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.chamadosResolvidos}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border p-6 flex items-center hover:shadow-lg transition">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <Users className="h-7 w-7" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.usuariosAtivos}</p>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-2xl shadow-md border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/cadastro-usuario">
                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Cadastrar Usuário</p>
                      <p className="text-sm text-gray-600">Adicionar novo usuário</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/cadastro-tecnico">
                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Cadastrar Técnico</p>
                      <p className="text-sm text-gray-600">Adicionar novo técnico</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/integrantes">
                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Gerenciar Usuários</p>
                      <p className="text-sm text-gray-600">Ver todos os usuários</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/chamados-usuarios">
                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Todos os Chamados</p>
                      <p className="text-sm text-gray-600">Visualizar chamados</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Chamados e Atividade */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chamados Recentes */}
            <div className="bg-white rounded-2xl shadow-md border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Chamados Recentes</h2>
                <Link href="/chamados-usuarios" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  Ver todos <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentChamados.length > 0 ? (
                  recentChamados.map((chamado, i) => (
                    <div key={chamado.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          chamado.prioridade === "alta" ? "bg-red-500" :
                          chamado.prioridade === "média" ? "bg-yellow-500" : "bg-blue-500"
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{chamado.titulo}</p>
                          <p className="text-xs text-gray-500">{chamado.usuario_nome} • {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPrioridadeColor(chamado.prioridade)}`}>
                          {chamado.prioridade}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(chamado.status)}`}>
                          {getStatusLabel(chamado.status)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum chamado encontrado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Atividade do Sistema */}
            <div className="bg-white rounded-2xl shadow-md border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Atividade do Sistema</h2>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Chamados hoje</span>
                  <span className="text-sm font-medium text-gray-900">
                    {recentChamados.filter(c => 
                      new Date(c.criado_em).toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resolvidos hoje</span>
                  <span className="text-sm font-medium text-gray-900">
                    {recentChamados.filter(c => 
                      c.status === "concluído" && 
                      new Date(c.criado_em).toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taxa de resolução</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.totalChamados > 0 ? Math.round((stats.chamadosResolvidos / stats.totalChamados) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Usuários ativos</span>
                  <span className="text-sm font-medium text-gray-900">{stats.usuariosAtivos}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Tendência */}
          <div className="bg-white rounded-2xl shadow-md border p-6">
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

        </div>
      </div>
    </DashboardLayout>
  );
}
