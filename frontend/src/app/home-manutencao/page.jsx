"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  User,
  ListFilter
} from "lucide-react";
import { apiRequest } from "@/lib/auth";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function TechnicianDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalChamadosSistema: 0,
    meusChamadosPendentes: 0,
    meusChamadosConcluidos: 0,
  });
  const [meusChamados, setMeusChamados] = useState([]); // Armazena TODOS os chamados do técnico
  const [loading, setLoading] = useState(true);
  const [listFilter, setListFilter] = useState('pendentes'); // NOVO: Estado para o filtro da lista

  useEffect(() => {
    if (user && user.id) {
      fetchDashboardData(user.id);
    } else if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  // Efeito para recalcular as estatísticas quando a lista de chamados do técnico mudar
  useEffect(() => {
    if (meusChamados.length > 0) {
      setStats(prevStats => ({
        ...prevStats,
        meusChamadosPendentes: meusChamados.filter(c => (c.status || "").toLowerCase() === "pendente").length,
        meusChamadosConcluidos: meusChamados.filter(c => ["concluido", "concluído"].includes((c.status || "").toLowerCase())).length,
      }));
    }
  }, [meusChamados]);

  const fetchDashboardData = async (tecnicoId) => {
    try {
      setLoading(true);
      const todosChamados = await apiRequest("/api/chamados");
      const chamadosArray = Array.isArray(todosChamados) ? todosChamados : [];
      
      // Armazena o total de chamados do sistema para o primeiro card
      setStats(prevStats => ({ ...prevStats, totalChamadosSistema: chamadosArray.length }));
      
      const chamadosDoTecnico = chamadosArray.filter(c => c.tecnico_id === tecnicoId);
      setMeusChamados(chamadosDoTecnico);

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard do técnico:", error);
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Lógica para filtrar a lista de chamados com base no filtro selecionado
  const chamadosVisiveisNaLista = useMemo(() => {
    if (listFilter === 'todos') {
      return meusChamados;
    }
    // O padrão é 'pendentes'
    return meusChamados.filter(c => (c.status || "").toLowerCase() === "pendente");
  }, [listFilter, meusChamados]);
  
  const quickActions = [
    {
      title: "Chamados",
      description: "Visualizar todas as suas ordens de serviço",
      icon: Wrench,
      href: "/vizualizar-chamados",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    
     {
      title: "Perfil",
      description: "Configurar seu perfil",
      icon: Settings,
      href: "/perfil",
       color: "bg-gray-500 hover:bg-gray-600",
    },
  ];

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      case "concluido": case "concluído": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-3"><Wrench className="h-8 w-8 text-primary" /><h1 className="text-xl font-bold text-foreground">Dashboard do Técnico</h1></div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* MUDANÇA: Título e lógica do card */}
                <CardTitle className="text-sm font-medium">Total de Chamados (Sistema)</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalChamadosSistema}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* MUDANÇA: Lógica corrigida para apenas status 'pendente' */}
                <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.meusChamadosPendentes}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chamados Concluídos</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.meusChamadosConcluidos}</div></CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <Link href={action.href} className="block h-full">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className={`p-3 rounded-lg ${action.color} inline-block mb-4`}><action.icon className="h-6 w-6 text-white" /></div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">Meus Chamados ({listFilter === 'pendentes' ? 'Pendentes' : 'Todos'})</h2>
              {/* NOVO: Filtro para a lista */}
              <Select value={listFilter} onValueChange={setListFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar lista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendentes">Mostrar: Pendentes</SelectItem>
                  <SelectItem value="todos">Mostrar: Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardContent className="p-4">
                {chamadosVisiveisNaLista.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {listFilter === 'pendentes' ? 'Nenhum chamado pendente atribuído a você.' : 'Nenhum chamado atribuído a você.'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {chamadosVisiveisNaLista.map((chamado) => (
                      <div key={chamado.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted">
                        <div className={`p-2 rounded-full ${getStatusColor(chamado.status)}`}>
                            {chamado.status === 'pendente' && <Clock className="h-5 w-5"/>}
                            {chamado.status === 'em andamento' && <Wrench className="h-5 w-5"/>}
                            {chamado.status === 'concluido' && <CheckCircle className="h-5 w-5"/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-medium truncate">{chamado.titulo || `Chamado #${chamado.id}`}</p>
                          <p className="text-xs text-muted-foreground">Aberto em: {new Date(chamado.criado_em).toLocaleDateString("pt-BR")}</p>
                        </div>
                        <Link href={`/chamados/${chamado.id}`} className="text-sm text-primary hover:underline">Detalhes</Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}