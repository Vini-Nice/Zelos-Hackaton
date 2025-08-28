"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  Clock, 
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
    if (user?.id) fetchChamados();
  }, [user]);

  const fetchChamados = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`/api/chamados?tecnico_id=${user.id}`);
      const data = Array.isArray(response) ? response : response?.data || [];
      setChamados(data);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
      setChamados([]);
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

  const filteredChamados = chamados.filter(c => filterStatus === "todos" || c.status === filterStatus);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Painel de Manutenção</h1>
              <p className="text-gray-600">Gerencie os chamados atribuídos a você</p>
            </div>
            <Button onClick={() => router.push("/vizualizar-chamados")} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ver Todos os Chamados
            </Button>
          </div>

          {/* Filtros */}
          <Card>
            <CardContent className="flex flex-col md:flex-row md:justify-between items-center gap-4">
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
                {filteredChamados.length} chamado{filteredChamados.length !== 1 ? "s" : ""}
              </div>
            </CardContent>
          </Card>

          {/* Lista de chamados */}
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="py-3 px-4 font-semibold">Chamado</th>
                      <th className="py-3 px-4 font-semibold">Solicitante</th>
                      <th className="py-3 px-4 font-semibold">Prioridade</th>
                      <th className="py-3 px-4 font-semibold">Data</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChamados.length > 0 ? (
                      filteredChamados.map((c) => (
                        <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium">{c.titulo}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{c.descricao}</p>
                          </td>
                          <td className="py-3 px-4 flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {c.usuario_nome}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getPrioridadeColor(c.prioridade)}>{c.prioridade}</Badge>
                          </td>
                          <td className="py-3 px-4 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(c.criado_em).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`flex items-center gap-1 ${getStatusColor(c.status)}`}>
                              {getStatusIcon(c.status)}
                              {getStatusLabel(c.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/vizualizar-chamados?id=${c.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Wrench className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/chamado/${c.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-12 w-12 text-gray-300" />
                            Nenhum chamado encontrado
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
