"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, AlertCircle, Eye, MessageSquare, Moon, Sun } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "em andamento": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  concluído: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const statusIcons = {
  pendente: Clock,
  "em andamento": AlertCircle,
  concluído: CheckCircle,
};

export default function MeusChamadosPage() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Aplicar tema ao carregar
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        if (user) {
          const chamadosData = await apiRequest(`/api/chamados?usuario_id=${user.id}`);
          setChamados(Array.isArray(chamadosData) ? chamadosData : []);
        }
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, [user]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const filteredChamados = chamados.filter((chamado) => {
    if (filter === "todos") return true;
    return chamado.status === filter;
  });

  const stats = {
    total: chamados.length,
    pendentes: chamados.filter((c) => c.status === "pendente").length,
    emAndamento: chamados.filter((c) => c.status === "em andamento").length,
    concluidos: chamados.filter((c) => c.status === "concluído").length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background dark:bg-gray-900 p-6 md:p-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background dark:bg-gray-900">
        {/* Header */}
        <header className="border-b border-border bg-card dark:bg-gray-800 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary dark:text-primary/80" />
              <h1 className="text-xl font-bold text-foreground dark:text-gray-100">Meus Chamados</h1>
            </div>
            <div className="flex items-center space-x-4">
              
              <Button asChild>
                <Link
                  href="/abrir-chamado"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70 flex items-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Novo Chamado
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Total de Chamados</p>
                    <p className="text-2xl font-bold text-foreground dark:text-gray-100">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary dark:text-primary/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Chamados Pendentes</p>
                    <p className="text-2xl font-bold text-foreground dark:text-gray-100">{stats.pendentes}</p>
                  </div>
                  <Clock className="h-8 w-8 text-accent dark:text-accent/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Chamados Concluídos</p>
                    <p className="text-2xl font-bold text-foreground dark:text-gray-100">{stats.concluidos}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setFilter("todos")}
                  variant={filter === "todos" ? "default" : "outline"}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    filter === "todos"
                      ? "bg-primary text-white dark:bg-primary/80 dark:hover:bg-primary/70"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Todos ({stats.total})
                </Button>
                <Button
                  onClick={() => setFilter("pendente")}
                  variant={filter === "pendente" ? "default" : "outline"}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    filter === "pendente"
                      ? "bg-yellow-600 text-white dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Pendentes ({stats.pendentes})
                </Button>
                <Button
                  onClick={() => setFilter("em andamento")}
                  variant={filter === "em andamento" ? "default" : "outline"}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    filter === "em andamento"
                      ? "bg-blue-600 text-white dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Em Andamento ({stats.emAndamento})
                </Button>
                <Button
                  onClick={() => setFilter("concluído")}
                  variant={filter === "concluído" ? "default" : "outline"}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    filter === "concluído"
                      ? "bg-green-600 text-white dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Concluídos ({stats.concluidos})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Chamados */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              {filteredChamados.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground dark:text-gray-100">
                          Chamado
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground dark:text-gray-100">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground dark:text-gray-100">
                          Data
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground dark:text-gray-100">
                          Tipo
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground dark:text-gray-100">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {filteredChamados.map((chamado) => {
                        const StatusIcon = statusIcons[chamado.status] || FileText;

                        return (
                          <tr key={chamado.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-foreground dark:text-gray-100">{chamado.titulo}</p>
                                <p className="text-sm text-muted-foreground dark:text-gray-400 truncate max-w-xs">
                                  {chamado.descricao}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[chamado.status]}`}>
                                <StatusIcon className="h-3 w-3" />
                                {chamado.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground dark:text-gray-400">
                              {new Date(chamado.criado_em).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground dark:text-gray-400">
                              {chamado.tipo_id}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-primary dark:hover:text-primary/80"
                                  title="Ver detalhes"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                                  title="Adicionar comentário"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
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
                  <FileText className="h-12 w-12 text-muted-foreground dark:text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground dark:text-gray-100 mb-2">
                    {filter === "todos" ? "Nenhum chamado encontrado" : `Nenhum chamado ${filter}`}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400 mb-6">
                    {filter === "todos"
                      ? "Você ainda não abriu nenhum chamado. Comece agora!"
                      : `Você não tem chamados com status "${filter}"`}
                  </p>
                  {filter === "todos" && (
                    <Button asChild>
                      <Link
                        href="/abrir-chamado"
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70"
                      >
                        Abrir Primeiro Chamado
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}