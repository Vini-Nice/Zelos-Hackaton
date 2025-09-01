"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, AlertTriangle, CheckCircle, Plus, Search, Bell, Moon, Sun } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { apiRequest } from "@/lib/auth";
import Link from "next/link";

export default function MaintenanceDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalChamados: 0,
    chamadosPendentes: 0,
    chamadosResolvidos: 0,
  });
  const [recentChamados, setRecentChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  const quickActions = [
    {
      title: "Nova Solicitação",
      description: "Criar nova ordem de manutenção",
      icon: Plus,
      href: "/requests/new",
      color: "bg-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70",
      urgent: false,
    },
    {
      title: "Meus Chamados Pendentes",
      description: "Visualizar suas ordens pendentes",
      icon: Clock,
      href: "/orders/pending",
      color: "bg-accent hover:bg-accent/90 dark:bg-accent/80 dark:hover:bg-accent/70",
      urgent: true,
      count: stats.chamadosPendentes,
    },
    {
      title: "Chamados Urgentes",
      description: "Seus chamados com prioridade alta",
      icon: AlertTriangle,
      href: "/maintenance/urgent",
      color: "bg-destructive hover:bg-destructive/90 dark:bg-destructive/80 dark:hover:bg-destructive/70",
      urgent: true,
      count: Array.isArray(recentChamados)
        ? recentChamados.filter((c) => (c.prioridade || "").toLowerCase() === "alta").length
        : 0,
    },
  ];

  useEffect(() => {
    // Aplicar tema ao carregar
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const chamados = await apiRequest("/api/chamados", "GET"); // Assumindo que retorna apenas os chamados do usuário autenticado

      const chamadosArray = Array.isArray(chamados) ? chamados : [];

      setStats({
        totalChamados: chamadosArray.length,
        chamadosPendentes: chamadosArray.filter((c) => (c.status || "").toLowerCase() === "pendente").length,
        chamadosResolvidos: chamadosArray.filter((c) =>
          ["concluido", "concluído"].includes((c.status || "").toLowerCase())
        ).length,
      });

      setRecentChamados(chamadosArray.slice(0, 5));
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      if (error.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "em andamento":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "concluido":
      case "concluído":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch ((prioridade || "").toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "média":
      case "media":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pendente":
        return "Pendente";
      case "em andamento":
        return "Em Andamento";
      case "concluido":
      case "concluído":
        return "Concluído";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
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
              <h1 className="text-xl font-bold text-foreground dark:text-gray-100">Painel do Usuário</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-200">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-200">
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Meus Chamados</p>
                    <p className="text-2xl font-bold text-foreground dark:text-gray-100">{stats.totalChamados}</p>
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
                    <p className="text-2xl font-bold text-foreground dark:text-gray-100">{stats.chamadosPendentes}</p>
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
                    <p className="text-2xl font-bold text-foreground dark:text-gray-100">{stats.chamadosResolvidos}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-foreground dark:text-gray-100 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                >
                  <CardContent className="p-4">
                    <Link href={action.href} className="block">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        {action.urgent && action.count > 0 && (
                          <Badge variant="destructive" className="text-xs dark:bg-red-900 dark:text-red-200">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground dark:text-gray-100 mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">{action.description}</p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold text-foreground dark:text-gray-100 mb-4">Meus Chamados Recentes</h2>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {recentChamados.length > 0 ? (
                    recentChamados.map((chamado) => (
                      <div key={chamado.id} className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(chamado.status)}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground dark:text-gray-100 font-medium">
                            Chamado #{chamado.id} - {chamado.titulo || "Sem título"}
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-gray-400">
                            {getStatusLabel(chamado.status)} • Prioridade: {chamado.prioridade || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Nenhum chamado recente.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}