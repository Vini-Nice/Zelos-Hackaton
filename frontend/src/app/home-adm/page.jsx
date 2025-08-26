"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
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
      // Aqui você pode usar apenas o endpoint se apiRequest já tiver baseURL
      const [chamados, usuarios] = await Promise.all([
        apiRequest("/api/chamados"),
        apiRequest("/api/usuarios")
      ]);

      const chamadosArray = Array.isArray(chamados) ? chamados : [];
      const usuariosArray = Array.isArray(usuarios) ? usuarios : [];

      setStats({
        totalChamados: chamadosArray.length,
        chamadosPendentes: chamadosArray.filter(c => (c.status || "").toLowerCase() === "pendente").length,
        chamadosResolvidos: chamadosArray.filter(c => (c.status || "").toLowerCase() === "concluido" || (c.status || "").toLowerCase() === "concluído").length,
        usuariosAtivos: usuariosArray.filter(u => (u.status || "").toLowerCase() === "ativo").length
      });

      setRecentChamados(chamadosArray.slice(0, 5));
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      case "concluido":
      case "concluído": return "bg-green-100 text-green-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch ((prioridade || "").toLowerCase()) {
      case "alta": return "bg-red-100 text-red-800";
      case "média":
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pendente": return "Pendente";
      case "em andamento": return "Em Andamento";
      case "concluido":
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
                recentChamados.map((chamado) => chamado.id ? (
                  <div key={chamado.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        (chamado.prioridade || "").toLowerCase() === "alta" ? "bg-red-500" :
                        (chamado.prioridade || "").toLowerCase() === "media" || (chamado.prioridade || "").toLowerCase() === "média" ? "bg-yellow-500" : "bg-blue-500"
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
                ) : null)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum chamado encontrado</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
