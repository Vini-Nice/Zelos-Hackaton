"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  Users,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";
import { apiRequest } from "@/lib/auth";
import Link from "next/link";

export default function MaintenanceDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    chamadosPendentes: 0,
    chamadosResolvidos: 0,
    usuariosAtivos: 0,
  });
  const [recentPendingChamados, setRecentPendingChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [chamadosData, usuariosData] = await Promise.all([
          apiRequest("/api/chamados"),
          apiRequest("/api/usuarios"),
        ]);

        const chamados = Array.isArray(chamadosData) ? chamadosData : [];
        const usuarios = Array.isArray(usuariosData) ? usuariosData : [];
        
        // 1. Filtra para pegar apenas os chamados com status "pendente"
        const chamadosPendentes = chamados.filter(c => (c.status || "").toLowerCase() === "pendente");

        // 2. Ordena os chamados pendentes por data (os mais recentes primeiro)
        const sortedPending = chamadosPendentes.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));

        setStats({
          chamadosPendentes: chamadosPendentes.length,
          chamadosResolvidos: chamados.filter(c => (c.status || "").toLowerCase() === "concluido").length,
          usuariosAtivos: usuarios.filter(u => u.funcao === 'tecnico' && u.status === 'ativo').length, // <-- Contagem de técnicos ativos
        });

        // 3. Pega os 5 mais recentes da lista já filtrada e ordenada
        setRecentPendingChamados(sortedPending.slice(0, 5));

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  const quickActions = [
    {
      title: "Chamados Pendentes",
      description: "Ordens aguardando ação",
      icon: Clock,
      href: "/visualizar-chamados", // <-- Rota corrigida
      count: stats.chamadosPendentes,
    },
    {
      title: "Apontamentos",
      description: "Visualizar e gerenciar",
      icon: BarChart3,
      href: "/apontamentos",
    },
  ];

  const systemModules = [
    {
      title: "Usuários",
      description: "Gerencie usuários e técnicos",
      icon: Users,
      href: "/integrantes",
      stats: `${stats.usuariosAtivos} técnicos ativos`, // <-- Texto corrigido
    },
    {
      title: "Perfil",
      description: "Configurar seu perfil",
      icon: Settings,
      href: "/perfil",
      stats: "Sistema",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <Wrench className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Home Administração</h1>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 space-y-8">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chamados Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.chamadosPendentes}</div>
                <p className="text-xs text-muted-foreground">Aguardando atendimento</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chamados Resolvidos</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.chamadosResolvidos}</div>
                <p className="text-xs text-muted-foreground">Concluídos com sucesso</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Técnicos Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.usuariosAtivos}</div>
                <p className="text-xs text-muted-foreground">Prontos para atender</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & System Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-foreground mb-4">Ações e Módulos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link href={action.href} key={action.title}>
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="pb-3"><div className="flex items-center justify-between"><action.icon className="h-6 w-6 text-primary" />{action.count > 0 && <Badge variant="destructive">{action.count}</Badge>}</div></CardHeader>
                      <CardContent><CardTitle className="text-base mb-1">{action.title}</CardTitle><CardDescription className="text-sm">{action.description}</CardDescription></CardContent>
                    </Card>
                  </Link>
                ))}
                 {systemModules.map((module) => (
                  <Link href={module.href} key={module.title}>
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="pb-3"><div className="flex items-center justify-between"><module.icon className="h-6 w-6 text-primary" /><Badge variant="secondary" className="text-xs">{module.stats}</Badge></div></CardHeader>
                      <CardContent><CardTitle className="text-base mb-1">{module.title}</CardTitle><CardDescription className="text-sm">{module.description}</CardDescription></CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-foreground mb-4">Pendentes Recentes</h2>
              <Card>
                <CardContent className="p-4">
                  {recentPendingChamados.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum chamado pendente no momento.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentPendingChamados.map((chamado) => (
                        <div key={chamado.id} className="flex items-center space-x-4">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-none truncate" title={chamado.titulo}>{chamado.titulo}</p>
                            <p className="text-sm text-muted-foreground">{new Date(chamado.criado_em).toLocaleDateString('pt-BR', {day: '2-digit', month: 'long'})}</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/chamados/${chamado.id}`}>Ver</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}