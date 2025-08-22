"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  Calendar
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";

export default function ChamadosUsuarios() {
  const router = useRouter();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    fetchChamados();
  }, []);

  const fetchChamados = async () => {
    try {
      const response = await apiRequest("/api/chamados");
      const data = Array.isArray(response) ? response : response?.data;
      setChamados(data || []);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      case "concluido": return "bg-green-100 text-green-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendente": return <Clock className="h-4 w-4" />;
      case "em andamento": return <AlertTriangle className="h-4 w-4" />;
      case "concluido": return <CheckCircle className="h-4 w-4" />;
      case "cancelado": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "em andamento": return "Em Andamento";
      case "concluido": return "Concluído";
      case "cancelado": return "Cancelado";
      default: return status;
    }
  };

  const handleStatusChange = async (chamadoId, newStatus) => {
    try {
      await apiRequest(`/api/chamados/${chamadoId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      fetchChamados();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const filteredChamados = chamados.filter(chamado => {
    const matchesSearch = chamado.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todos" || chamado.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: chamados.length,
    pendentes: chamados.filter(c => c.status === "pendente").length,
    emAndamento: chamados.filter(c => c.status === "em andamento").length,
    concluidos: chamados.filter(c => c.status === "concluido").length,
    cancelados: chamados.filter(c => c.status === "cancelado").length
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Todos os Chamados</h1>
              <p className="text-gray-600">Visualize e gerencie todos os chamados do sistema</p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.emAndamento}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.concluidos}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancelados</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelados}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Busca */}
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar chamados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="em andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluídos</SelectItem>
                  <SelectItem value="cancelado">Cancelados</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-center bg-gray-100 rounded-lg px-4">
                <span className="text-sm text-gray-600">
                  {filteredChamados.length} chamado{filteredChamados.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Chamados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Chamados do Sistema
              </CardTitle>
              <CardDescription>
                Lista completa de todos os chamados registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-900">Chamado</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Solicitante</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Data</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Técnico</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChamados.length > 0 ? (
                      filteredChamados.map((chamado, index) => (
                        <tr
                          key={chamado.id}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
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
                              <span className="text-gray-700">Usuário #{chamado.usuario_id} </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Select
                              value={chamado.status}
                              onValueChange={(value) => handleStatusChange(chamado.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="em andamento">Em Andamento</SelectItem>
                                <SelectItem value="concluido">Concluído</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">
                                {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {chamado.tecnico_id ? `Técnico #${chamado.tecnico_id}` : "Não atribuído"}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/chamado/${chamado.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          Nenhum chamado encontrado
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
