"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Eye, Clock, CheckCircle, AlertTriangle, XCircle, User, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";

export default function ChamadosUsuarios() {
  const router = useRouter();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [updatingId, setUpdatingId] = useState(null);

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

  const statusMap = {
    pendente: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4" />, label: "Pendente" },
    "em andamento": { color: "bg-blue-100 text-blue-800", icon: <AlertTriangle className="h-4 w-4" />, label: "Em Andamento" },
    concluido: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4" />, label: "Concluído" },
    cancelado: { color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4" />, label: "Cancelado" },
  };

  const handleStatusChange = async (chamadoId, newStatus) => {
    try {
      setUpdatingId(chamadoId);
      await apiRequest(`/api/chamados/${chamadoId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setChamados(prev =>
        prev.map(c => (c.id === chamadoId ? { ...c, status: newStatus } : c))
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredChamados = useMemo(() => {
    return chamados.filter(chamado => {
      const matchesSearch =
        chamado.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "todos" || chamado.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [chamados, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    total: chamados.length,
    pendentes: chamados.filter(c => c.status === "pendente").length,
    emAndamento: chamados.filter(c => c.status === "em andamento").length,
    concluidos: chamados.filter(c => c.status === "concluido").length,
    cancelados: chamados.filter(c => c.status === "cancelado").length,
  }), [chamados]);

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
            {[
              { title: "Total", value: stats.total, icon: <FileText className="h-8 w-8 text-blue-600" /> },
              { title: "Pendentes", value: stats.pendentes, icon: <Clock className="h-8 w-8 text-yellow-600" /> },
              { title: "Em Andamento", value: stats.emAndamento, icon: <AlertTriangle className="h-8 w-8 text-blue-600" /> },
              { title: "Concluídos", value: stats.concluidos, icon: <CheckCircle className="h-8 w-8 text-green-600" /> },
              { title: "Cancelados", value: stats.cancelados, icon: <XCircle className="h-8 w-8 text-red-600" /> },
            ].map((stat, idx) => (
              <Card key={idx}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  {stat.icon}
                </CardContent>
              </Card>
            ))}
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
                  {filteredChamados.length} chamado{filteredChamados.length !== 1 ? "s" : ""}
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
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-900">Chamado</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-900">Solicitante</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-900">Data</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-900">Técnico</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-900">Ações</th>
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
                              <span className="text-gray-700">Usuário #{chamado.usuario_id}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Select
                              value={chamado.status}
                              onValueChange={(value) => handleStatusChange(chamado.id, value)}
                              disabled={updatingId === chamado.id}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusMap).map(([key, { label }]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">
                                {new Date(chamado.criado_em).toLocaleDateString("pt-BR")}
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
                              aria-label="Visualizar chamado"
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
