"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { FileText, Clock, CheckCircle, AlertCircle, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

const statusColors = {
  "pendente": "bg-yellow-100 text-yellow-800",
  "em andamento": "bg-blue-100 text-blue-800",
  "concluído": "bg-green-100 text-green-800",
};

const statusIcons = {
  "pendente": Clock,
  "em andamento": AlertCircle,
  "concluído": CheckCircle,
};

export default function MeusChamadosPage() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        if (user) {
          const chamadosData = await apiRequest(`/api/chamados?usuario_id=${user.id}`);
          setChamados(chamadosData);
        }
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, [user]);

  const filteredChamados = chamados.filter(chamado => {
    if (filter === "todos") return true;
    return chamado.status === filter;
  });

  const stats = {
    total: chamados.length,
    pendentes: chamados.filter(c => c.status === "pendente").length,
    emAndamento: chamados.filter(c => c.status === "em andamento").length,
    concluidos: chamados.filter(c => c.status === "concluído").length,
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Chamados</h1>
              <p className="text-gray-600">Gerencie e acompanhe seus chamados de suporte</p>
            </div>
            <Link
              href="/abrir-chamado"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FileText className="h-5 w-5" />
              Novo Chamado
            </Link>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Total</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pendentes}</p>
              <p className="text-gray-600">Pendentes</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.emAndamento}</p>
              <p className="text-gray-600">Em Andamento</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <p className="text-3xl font-bold text-green-600">{stats.concluidos}</p>
              <p className="text-gray-600">Concluídos</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("todos")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "todos"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos ({stats.total})
              </button>
              <button
                onClick={() => setFilter("pendente")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "pendente"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pendentes ({stats.pendentes})
              </button>
              <button
                onClick={() => setFilter("em andamento")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "em andamento"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Em Andamento ({stats.emAndamento})
              </button>
              <button
                onClick={() => setFilter("concluído")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "concluído"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Concluídos ({stats.concluidos})
              </button>
            </div>
          </div>

          {/* Lista de Chamados */}
          <div className="bg-white rounded-xl shadow-sm border">
            {filteredChamados.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Chamado</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Data</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tipo</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredChamados.map((chamado) => {
                      const StatusIcon = statusIcons[chamado.status];
                      return (
                        <tr key={chamado.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{chamado.titulo}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {chamado.descricao}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[chamado.status]}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {chamado.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {chamado.tipo_id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                className="p-2 text-gray-400 hover:text-blue-600 transition"
                                title="Ver detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 text-gray-400 hover:text-green-600 transition"
                                title="Adicionar comentário"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === "todos" ? "Nenhum chamado encontrado" : `Nenhum chamado ${filter}`}
                </h3>
                <p className="text-gray-500 mb-6">
                  {filter === "todos" 
                    ? "Você ainda não abriu nenhum chamado. Comece agora!"
                    : `Você não tem chamados com status "${filter}"`
                  }
                </p>
                {filter === "todos" && (
                  <Link
                    href="/abrir-chamado"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Abrir Primeiro Chamado
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
