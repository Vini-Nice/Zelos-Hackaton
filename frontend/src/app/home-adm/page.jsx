"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Settings,
  BarChart3,
  Plus,
  Search,
  Bell,
} from "lucide-react";
import { apiRequest } from "@/lib/auth";
import Link from "next/link";

export default function MaintenanceDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalChamados: 0,
    chamadosPendentes: 0,
    chamadosResolvidos: 0,
    usuariosAtivos: 0,
  });
  const [recentChamados, setRecentChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickActions = [

    {
      title: "Chamados Pendente",
      description: "12 ordens aguardando aprovação",
      icon: Clock,
      href: "/orders/pending",
      color: "bg-accent hover:bg-accent/90",
      urgent: true,
      count: 12,
    },
    {
      title: "Chamados",
      description: "Gerencie os chamados",
      icon: AlertTriangle,
      href: "/chamados-usuarios",
      color: "bg-destructive hover:bg-destructive/90",
      urgent: true,
      count: 3,
    },
    {
      title: "Apontamentos",
      description: "Visualizar apontamentos",
      icon: BarChart3,
      href: "/apontamentos",
      color: "bg-secondary hover:bg-secondary/90",
      urgent: false,
    },
  ];

  const systemModules = [

    {
      title: "Usuários",
      description: "Gerencie usuários",
      icon: Users,
      href: "/integrantes",
      stats: "15 técnicos",
    },

    {
      title: "Perfil",
      description: "Configurar perfil",
      icon: Settings,
      href: "/perfil",
      stats: "Sistema",
    },
  ];

  const recentActivity = [
    { id: 1, action: "Ordem #1234 concluída", time: "2 min atrás", status: "success" },
    { id: 2, action: "Equipamento EQ-001 em manutenção", time: "15 min atrás", status: "warning" },
    { id: 3, action: "Nova solicitação recebida", time: "1 hora atrás", status: "info" },
    { id: 4, action: "Técnico João Silva disponível", time: "2 horas atrás", status: "success" },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [chamados, usuarios] = await Promise.all([
        apiRequest("/api/chamados"),
        apiRequest("/api/usuarios"),
      ]);

      const chamadosArray = Array.isArray(chamados) ? chamados : [];
      const usuariosArray = Array.isArray(usuarios) ? usuarios : [];

      setStats({
        totalChamados: chamadosArray.length,
        chamadosPendentes: chamadosArray.filter((c) => (c.status || "").toLowerCase() === "pendente").length,
        chamadosResolvidos: chamadosArray.filter((c) =>
          ["concluido", "concluído"].includes((c.status || "").toLowerCase())
        ).length,
        usuariosAtivos: usuariosArray.filter((u) => (u.status || "").toLowerCase() === "ativo").length,
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
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "em andamento":
        return "bg-blue-100 text-blue-800";
      case "concluido":
      case "concluído":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch ((prioridade || "").toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "média":
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Home Administração</h1>
            </div>
            <div className="flex items-center space-x-4">

            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ordens Abertas</p>
                    <p className="text-2xl font-bold text-foreground">{stats.chamadosPendentes}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>



            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Técnicos Disponíveis</p>
                    <p className="text-2xl font-bold text-foreground">{stats.usuariosAtivos}</p>
                  </div>
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Link href={action.href} className="block">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        {action.urgent && action.count && (
                          <Badge variant="destructive" className="text-xs">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* System Modules and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-foreground mb-4">Módulos do Sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemModules.map((module, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <module.icon className="h-6 w-6 text-primary" />
                        <Badge variant="secondary" className="text-xs">
                          {module.stats}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Link href={module.href} className="block">
                        <CardTitle className="text-base mb-2">{module.title}</CardTitle>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* card de chamados pendentes */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Chamados Pendentes</h2>
              <Card>
                <CardContent className="p-4">
                  {recentChamados.filter(c => c.status === "pendente").length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum chamado pendente.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentChamados
                        .filter((chamado) => chamado.status === "pendente")
                        .map((chamado) => (
                          <div key={chamado.id} className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(chamado.status)}`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground font-medium">
                                {chamado.titulo || `Chamado #${chamado.id}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Status: {getStatusLabel(chamado.status)} •
                                Prioridade:{" "}
                                <span className={`px-1 rounded ${getPrioridadeColor(chamado.prioridade)}`}>
                                  {chamado.prioridade || "N/A"}
                                </span>
                              </p>
                            </div>
                            <Link
                              href={`/chamados/${chamado.id}`}
                              className="text-xs text-primary hover:underline"
                            >
                              Ver
                            </Link>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>



          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
