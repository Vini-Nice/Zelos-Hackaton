"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  Wrench,
  AlertTriangle,
  XCircle,
  User,
  Calendar,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function HomeManutencao() {
  const router = useRouter();
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    fetchChamados();
  }, []);

  const fetchChamados = async () => {
    try {
      // Buscar chamados atribuídos ao técnico
      const response = await apiRequest(`/api/chamados?tecnico_id=${user?.id}`);
      if (response.success) {
        setChamados(response.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (chamadoId, novoStatus) => {
    try {
      const response = await apiRequest(`/api/chamados/${chamadoId}`, {
        method: "PUT",
        body: JSON.stringify({
          status: novoStatus
        })
      });
      
      if (response.success) {
        fetchChamados();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendente": return <Clock className="h-4 w-4" />;
      case "em andamento": return <AlertTriangle className="h-4 w-4" />;
      case "concluído": return <CheckCircle className="h-4 w-4" />;
      case "cancelado": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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

  const filteredChamados = chamados.filter(chamado => {
    return filterStatus === "todos" || chamado.status === filterStatus;
  });

  const stats = {
    total: chamados.length,
    emAberto: chamados.filter((c) => c.status === "pendente").length,
    emAndamento: chamados.filter((c) => c.status === "em andamento").length,
    resolvidos: chamados.filter((c) => c.status === "concluído").length,
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel de Manutenção</h1>
              <p className="text-gray-600">Gerencie os chamados atribuídos a você</p>
            </div>
            <Button
              onClick={() => router.push("/vizualizar-chamados")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Ver Todos os Chamados
            </Button>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Em Aberto</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.emAberto}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.emAndamento}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Resolvidos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolvidos}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total de Chamados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Chamados Atribuídos</h2>
                  <p className="text-gray-600">Gerencie os chamados que foram atribuídos a você</p>
                </div>
                <div className="flex items-center gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="em andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluído">Concluídos</SelectItem>
                      <SelectItem value="cancelado">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-600">
                    {filteredChamados.length} chamado{filteredChamados.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de chamados */}
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="py-3 px-4 font-semibold text-gray-900">Chamado</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Solicitante</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Prioridade</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Data</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChamados.length > 0 ? (
                      filteredChamados.map((chamado, index) => (
                        <tr
                          key={chamado.id}
                          className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{chamado.titulo}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {chamado.descricao}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">{chamado.usuario_nome}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getPrioridadeColor(chamado.prioridade)}>
                              {chamado.prioridade}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">
                                {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Select
                              value={chamado.status}
                              onValueChange={(value) => handleStatusChange(chamado.id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="em andamento">Em Andamento</SelectItem>
                                <SelectItem value="concluído">Concluído</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/vizualizar-chamados?id=${chamado.id}`)}
                                className="h-8 w-8 p-0"
                              >
                                <Wrench className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/chamado/${chamado.id}`)}
                                className="h-8 w-8 p-0"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-12 w-12 text-gray-300" />
                            <p>Nenhum chamado encontrado</p>
                            <p className="text-sm">Você não possui chamados atribuídos no momento.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
