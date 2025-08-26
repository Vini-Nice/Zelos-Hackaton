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

// Dados mockados
const mockApontamentos = [
  {
    id: 1,
    tecnico: "João Silva",
    chamado_id: 123,
    titulo_chamado: "Problema com impressora",
    descricao: "Verificado problema na impressora. Substituído cartucho e limpeza realizada.",
    tempo_execucao: 45,
    status: "concluido",
    data: "2024-01-15T10:30:00",
    prioridade: "média"
  },
  {
    id: 2,
    tecnico: "Maria Santos",
    chamado_id: 124,
    titulo_chamado: "Computador não liga",
    descricao: "Diagnosticado problema na fonte de alimentação. Substituição realizada.",
    tempo_execucao: 90,
    status: "concluido",
    data: "2024-01-15T14:20:00",
    prioridade: "alta"
  },
  {
    id: 3,
    tecnico: "Carlos Oliveira",
    chamado_id: 125,
    titulo_chamado: "Internet lenta",
    descricao: "Verificado cabo de rede e configurações. Problema resolvido.",
    tempo_execucao: 30,
    status: "concluido",
    data: "2024-01-15T16:45:00",
    prioridade: "baixa"
  },
  {
    id: 4,
    tecnico: "Ana Costa",
    chamado_id: 126,
    titulo_chamado: "Software travando",
    descricao: "Atualização de drivers e limpeza de cache realizada.",
    tempo_execucao: 60,
    status: "em andamento",
    data: "2024-01-15T09:15:00",
    prioridade: "média"
  },
  {
    id: 5,
    tecnico: "Pedro Lima",
    chamado_id: 127,
    titulo_chamado: "Problema de rede",
    descricao: "Configuração de switch e verificação de conectividade.",
    tempo_execucao: 75,
    status: "concluido",
    data: "2024-01-14T15:30:00",
    prioridade: "alta"
  }
];

const mockTecnicos = [
  { id: 1, nome: "João Silva", total_chamados: 45, tempo_medio: 52, satisfacao: 4.8 },
  { id: 2, nome: "Maria Santos", total_chamados: 38, tempo_medio: 48, satisfacao: 4.9 },
  { id: 3, nome: "Carlos Oliveira", total_chamados: 42, tempo_medio: 55, satisfacao: 4.7 },
  { id: 4, nome: "Ana Costa", total_chamados: 35, tempo_medio: 61, satisfacao: 4.6 },
  { id: 5, nome: "Pedro Lima", total_chamados: 40, tempo_medio: 49, satisfacao: 4.8 }
];

export default function ApontamentosAdmin() {
  const { user } = useAuth();
  const router = useRouter();

  const [apontamentos, setApontamentos] = useState(mockApontamentos);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState("todos");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("7dias");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  useEffect(() => {
    if (user?.funcao !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (user?.funcao !== "admin") return null;

  // Filtro de apontamentos
  const apontamentosFiltrados = apontamentos.filter(ap => {
    const matchTecnico = tecnicoSelecionado === "todos" || ap.tecnico === tecnicoSelecionado;
    const matchStatus = statusFiltro === "todos" || ap.status === statusFiltro;
    return matchTecnico && matchStatus;
  });

  // Estatísticas
  const estatisticas = {
    totalApontamentos: apontamentosFiltrados.length,
    tempoMedio: Math.round(apontamentosFiltrados.reduce((acc, ap) => acc + ap.tempo_execucao, 0) / (apontamentosFiltrados.length || 1)),
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

  const formatTempo = (minutos) => minutos < 60 ? `${minutos} min` : `${Math.floor(minutos/60)}h ${minutos%60}min`;

  const formatData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', { 
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Apontamentos dos Técnicos</h1>
          <p className="text-gray-600 dark:text-gray-300">Acompanhe a produtividade e eficiência da equipe técnica</p>

          {/* Filtros */}
          <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={tecnicoSelecionado} onValueChange={setTecnicoSelecionado}>
                <SelectTrigger><SelectValue placeholder="Filtrar por técnico" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os técnicos</SelectItem>
                  {mockTecnicos.map(t => <SelectItem key={t.id} value={t.nome}>{t.nome}</SelectItem>)}
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
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{apont.titulo_chamado}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{apont.descricao}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{apont.tecnico}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatData(apont.data)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(apont.status)}>{apont.status}</Badge>
                          <Badge className={getPrioridadeColor(apont.prioridade)}>{apont.prioridade}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Chamado #{apont.chamado_id}</span>
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400"><Clock className="h-4 w-4" />{formatTempo(apont.tempo_execucao)}</span>
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
                    {mockTecnicos.map(t => (
                      <div key={t.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{t.nome}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{t.total_chamados} chamados</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Tempo médio:</span>
                          <span className="font-medium">{t.tempo_medio} min</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Satisfação:</span>
                          <span className="flex items-center gap-1"><span className="font-medium">{t.satisfacao}</span><span className="text-yellow-500">★</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Tempo por Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Concluídos</span>
                      <span className="font-medium">52 min</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Em andamento</span>
                      <span className="font-medium">61 min</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Pendentes</span>
                      <span className="font-medium">0 min</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
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
