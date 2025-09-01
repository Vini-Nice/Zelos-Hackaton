"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  Wrench,
  FileText
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useRouter } from "next/navigation";

export default function ApontamentosAdmin() {
  const { user } = useAuth();
  const router = useRouter();

  const [apontamentos, setApontamentos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState("todos");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("7dias");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.funcao !== "admin") {
      router.push("/");
      return;
    }

    const fetchDados = async () => {
      try {
        setLoading(true);
        // Buscar apontamentos
        const apontRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/apontamentos`);
        const apontData = await apontRes.json();

        // Buscar técnicos
        const tecnicoRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/usuarios`);
        const tecnicoData = await tecnicoRes.json();

        setApontamentos(apontData);
        setTecnicos(tecnicoData.filter(u => u.funcao === "tecnico"));
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [user, router]);

  if (user?.funcao !== "admin") return null;
  if (loading) return <p className="text-center mt-10">Carregando apontamentos...</p>;

  // Filtro de apontamentos
  const apontamentosFiltrados = apontamentos.filter(ap => {
    const matchTecnico = tecnicoSelecionado === "todos" || ap.tecnico?.nome === tecnicoSelecionado;
    const matchStatus = statusFiltro === "todos" || ap.status === statusFiltro;
    return matchTecnico && matchStatus;
  });

  // Estatísticas
  const estatisticas = {
    totalApontamentos: apontamentosFiltrados.length,
    tempoMedio: Math.round(apontamentosFiltrados.reduce((acc, ap) => acc + (ap.duracao || 0), 0) / (apontamentosFiltrados.length || 1) / 60),
    concluidos: apontamentosFiltrados.filter(ap => ap.status === "concluido").length,
    emAndamento: apontamentosFiltrados.filter(ap => ap.status === "em andamento").length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "concluido": return "bg-green-100 text-green-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
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

  const formatTempo = (segundos) => segundos < 3600 ? `${Math.round(segundos / 60)} min` : `${Math.floor(segundos / 3600)}h ${Math.round((segundos % 3600) / 60)}min`;

  const formatData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Apontamentos</h1>
          </div>
          <div className="flex items-center space-x-4">

          </div>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">


          {/* Filtros */}
          <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={tecnicoSelecionado} onValueChange={setTecnicoSelecionado}>
                <SelectTrigger><SelectValue placeholder="Filtrar por técnico" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os técnicos</SelectItem>
                  {tecnicos.map(t => <SelectItem key={t.id} value={t.nome}>{t.nome}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                <SelectTrigger><SelectValue placeholder="Período" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                  <SelectItem value="1ano">Último ano</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="concluido">Concluídos</SelectItem>
                  <SelectItem value="em andamento">Em andamento</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg px-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {apontamentosFiltrados.length} apontamento{apontamentosFiltrados.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Apontamentos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{estatisticas.totalApontamentos}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{estatisticas.tempoMedio} min</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticas.concluidos}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Em Andamento</p>
                  <p className="text-2xl font-bold text-blue-600">{estatisticas.emAndamento}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </CardContent>
            </Card>
          </div>

          {/* Lista de Apontamentos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Apontamentos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {apontamentosFiltrados.map(apont => (
                    <div key={apont.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{apont.chamado?.titulo}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{apont.descricao}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{apont.tecnico?.nome}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatData(apont.comeco)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(apont.status)}>{apont.status}</Badge>
                          
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Chamado #{apont.chamado_id}</span>
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400"><Clock className="h-4 w-4" />{formatTempo(apont.duracao)}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Performance Técnicos e Gráficos */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Performance dos Técnicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tecnicos.map(t => (
                      <div key={t.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{t.nome}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{t.total_chamados || 0} chamados</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Tempo médio:</span>
                          <span className="font-medium">{t.tempo_medio || 0} min</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Satisfação:</span>
                          <span className="flex items-center gap-1"><span className="font-medium">{t.satisfacao || 0}</span><span className="text-yellow-500">★</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
