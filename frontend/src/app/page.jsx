"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider/AuthProvider"; // Importado para pegar o usuário
import Link from "next/link";

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useAuth(); // Pega o usuário logado
  const [stats, setStats] = useState({
    meusChamados: 0,
    meusPendentes: 0,
    meusResolvidos: 0,
  });
  const [meusChamadosRecentes, setMeusChamadosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A busca de dados só ocorre se o usuário estiver logado
    if (user && user.id) {
      fetchDashboardData(user.id);
    }
  }, [user]);

  const fetchDashboardData = async (usuarioId) => {
    setLoading(true);
    try {
      const todosChamados = await apiRequest("/api/chamados");
      const chamadosArray = Array.isArray(todosChamados) ? todosChamados : [];

      // Correção: Filtra para mostrar apenas os chamados do usuário logado
      const meusChamados = chamadosArray.filter(c => c.usuario_id == usuarioId);

      setStats({
        meusChamados: meusChamados.length,
        meusPendentes: meusChamados.filter(c => (c.status || "").toLowerCase() === "pendente").length,
        meusResolvidos: meusChamados.filter(c => ["concluido", "concluído"].includes((c.status || "").toLowerCase())).length,
      });

      setMeusChamadosRecentes(meusChamados.slice(0, 5)); // Pega os 5 mais recentes
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      if (error.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Ações rápidas relevantes para o usuário
  const quickActions = [
    {
      title: "Abrir Novo Chamado",
      description: "Precisa de ajuda? Crie uma nova solicitação.",
      icon: Plus,
      href: "/abrir-chamado",
      color: "bg-primary hover:bg-primary/90",
    },
    {
      title: "Meus Chamados Pendentes",
      description: "Acompanhe suas solicitações em aberto.",
      icon: Clock,
      href: "/meus-chamados",
      color: "bg-accent hover:bg-accent/90",
      urgent: true,
      count: stats.meusPendentes,
    },
  ];

  const getStatusLabel = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "concluido" || s === "concluído") return "Concluído";
    if (s === "em andamento") return "Em Andamento";
    return "Pendente";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Painel do Usuário</h1>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Meus Chamados</p>
                    <p className="text-2xl font-bold text-foreground">{stats.meusChamados}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold text-foreground">{stats.meusPendentes}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Concluídos</p>
                    <p className="text-2xl font-bold text-foreground">{stats.meusResolvidos}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Link href={action.href} className="block">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        {action.urgent && action.count > 0 && (
                          <Badge variant="destructive" className="text-xs">{action.count}</Badge>
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

          {/* Meus Chamados Recentes */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Meus Chamados Recentes</h2>
            <Card>
              <CardContent className="p-4">
                {meusChamadosRecentes.length > 0 ? (
                  <div className="space-y-4">
                    {meusChamadosRecentes.map((chamado) => (
                      <div key={chamado.id} className="flex items-center space-x-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-medium truncate">{chamado.titulo || `Chamado #${chamado.id}`}</p>
                          <p className="text-xs text-muted-foreground">Status: {getStatusLabel(chamado.status)}</p>
                        </div>
                        <Link href={`/chamados/${chamado.id}`} className="text-xs text-primary hover:underline">
                          Ver
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Você ainda não abriu nenhum chamado.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}