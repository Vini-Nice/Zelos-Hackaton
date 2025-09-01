"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, FileText, Wrench, AlertTriangle, XCircle, User, Calendar, ArrowRight, MessageSquare, Moon, Sun, Download, RefreshCw, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

export default function HomeManutencao() {
  const router = useRouter();
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [theme, setTheme] = useState("light");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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
      toast.error("Erro ao carregar chamados. Tente novamente.");
      setChamados([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "em andamento": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "concluído": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelado": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
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
      case "alta": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "média": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "baixa": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedChamados = [...chamados]
    .filter(c => filterStatus === "todos" || c.status === filterStatus)
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortColumn === "titulo") return a.titulo.localeCompare(b.titulo) * direction;
      if (sortColumn === "prioridade") return a.prioridade.localeCompare(b.prioridade) * direction;
      if (sortColumn === "criado_em") return (new Date(a.criado_em) - new Date(b.criado_em)) * direction;
      if (sortColumn === "status") return a.status.localeCompare(b.status) * direction;
      return 0;
    });

  const exportReport = () => {
    const csvContent = [
      ["ID", "Título", "Descrição", "Solicitante", "Email", "Prioridade", "Status", "Data"],
      ...sortedChamados.map(c => [
        c.id,
        c.titulo,
        c.descricao,
        c.usuario_nome,
        c.email || "N/A",
        c.prioridade,
        getStatusLabel(c.status),
        new Date(c.criado_em).toLocaleDateString("pt-BR"),
      ]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_chamados_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Relatório exportado com sucesso!");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary dark:border-primary/80"></div>
            <p className="text-foreground dark:text-gray-100">Carregando chamados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <Toaster position="top-right" />
        {/* Header */}
        <header className="border-b border-border bg-card dark:bg-gray-800 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary dark:text-primary/80" />
              <h1 className="text-xl font-bold text-foreground dark:text-gray-100">Home Manutenção </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="dark:border-gray-600 dark:text-gray-200"
                aria-label="Alternar tema"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => router.push("/vizualizar-chamados")}
                className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70"
                aria-label="Ver todos os chamados"
              >
                <MessageSquare className="h-4 w-4" />
                Ver Todos os Chamados
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Ações Rápidas */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
                
                <Button
                  onClick={fetchChamados}
                  className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70"
                  aria-label="Atualizar lista de chamados"
                >
                  <RefreshCw className="h-4 w-4" />
                  Atualizar Lista
                </Button>
                <Button
                  onClick={exportReport}
                  className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70"
                  aria-label="Exportar relatório"
                >
                  <Download className="h-4 w-4" />
                  Exportar Relatório
                </Button>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="flex flex-col md:flex-row md:justify-between items-center gap-4 p-6">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="em andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluído">Concluídos</SelectItem>
                    <SelectItem value="cancelado">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground dark:text-gray-400">
                  {sortedChamados.length} chamado{sortedChamados.length !== 1 ? "s" : ""}
                </div>
              </CardContent>
            </Card>

            {/* Lista de chamados */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-600">
                        <th
                          className="py-3 px-4 font-semibold text-foreground dark:text-gray-100 min-w-[150px] cursor-pointer"
                          onClick={() => handleSort("titulo")}
                          aria-sort={sortColumn === "titulo" ? sortDirection : "none"}
                        >
                          Chamado {sortColumn === "titulo" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="py-3 px-4 font-semibold text-foreground dark:text-gray-100 min-w-[200px]">
                          Solicitante
                        </th>
                        <th
                          className="py-3 px-4 font-semibold text-foreground dark:text-gray-100 cursor-pointer"
                          onClick={() => handleSort("prioridade")}
                          aria-sort={sortColumn === "prioridade" ? sortDirection : "none"}
                        >
                          Prioridade {sortColumn === "prioridade" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          className="py-3 px-4 font-semibold text-foreground dark:text-gray-100 cursor-pointer"
                          onClick={() => handleSort("criado_em")}
                          aria-sort={sortColumn === "criado_em" ? sortDirection : "none"}
                        >
                          Data {sortColumn === "criado_em" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          className="py-3 px-4 font-semibold text-foreground dark:text-gray-100 cursor-pointer"
                          onClick={() => handleSort("status")}
                          aria-sort={sortColumn === "status" ? sortDirection : "none"}
                        >
                          Status {sortColumn === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="py-3 px-4 font-semibold text-foreground dark:text-gray-100">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedChamados.length > 0 ? (
                        sortedChamados.map((c) => (
                          <tr key={c.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="py-3 px-4">
                              <p className="font-medium text-foreground dark:text-gray-100">{c.titulo}</p>
                              <p className="text-sm text-muted-foreground dark:text-gray-400 truncate max-w-xs">{c.descricao}</p>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                                <div>
                                  <p className="text-foreground dark:text-gray-100">{c.usuario_nome}</p>
                                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                                    {c.email || "Email não disponível"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getPrioridadeColor(c.prioridade)}>{c.prioridade}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                                <p className="text-foreground dark:text-gray-100">
                                  {new Date(c.criado_em).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
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
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary dark:hover:text-primary/80"
                                aria-label={`Visualizar chamado ${c.titulo}`}
                              >
                                <Wrench className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/chamado/${c.id}`)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary dark:hover:text-primary/80"
                                aria-label={`Detalhes do chamado ${c.titulo}`}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground dark:text-gray-400">
                            <div className="flex flex-col items-center gap-2">
                              <FileText className="h-12 w-12 text-gray-300 dark:text-gray-500" />
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
      </div>
    </DashboardLayout>
  );
}