"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Clock,
  Users,
  TrendingUp,
  Wrench,
  FileText,
  ChevronDown
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/auth";
import PerformanceChart from "@/components/PerformanceChart/PerformanceChart"; // Verifique se o caminho está correto

export default function ApontamentosAdmin() {
  const { user } = useAuth();
  const router = useRouter();

  const [apontamentos, setApontamentos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [performanceTecnicos, setPerformanceTecnicos] = useState([]);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState("todos");
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
        const [apontData, usuariosData, chamadosData] = await Promise.all([
          apiRequest("/api/apontamentos"),
          apiRequest("/api/usuarios"),
          apiRequest("/api/chamados"),
        ]);

        const allTecnicos = usuariosData.filter(u => u.funcao === "tecnico");
        setTecnicos(allTecnicos);

        const userMap = usuariosData.reduce((acc, u) => {
          acc[u.id] = u.nome;
          return acc;
        }, {});

        const chamadoMap = chamadosData.reduce((acc, c) => {
            acc[c.id] = c.titulo;
            return acc;
        }, {});

        const apontamentosComNomes = apontData.map(apont => ({
          ...apont,
          tecnicoNome: userMap[apont.tecnico_id] || "N/A",
          chamadoTitulo: chamadoMap[apont.chamado_id] || `Chamado #${apont.chamado_id}`,
        }));
        setApontamentos(apontamentosComNomes);
        
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [user, router]);

  const apontamentosFiltrados = useMemo(() => {
    return apontamentos.filter(ap => {
      const matchTecnico = tecnicoSelecionado === "todos" || ap.tecnicoNome === tecnicoSelecionado;
      const matchStatus = statusFiltro === "todos" || ap.status === statusFiltro;
      return matchTecnico && matchStatus;
    });
  }, [apontamentos, tecnicoSelecionado, statusFiltro]);
  
  // NOVO: Agrupamento dos apontamentos por chamado_id
  const groupedApontamentos = useMemo(() => {
    return apontamentosFiltrados.reduce((acc, ap) => {
      const key = ap.chamado_id;
      if (!acc[key]) {
        acc[key] = {
          chamadoTitulo: ap.chamadoTitulo,
          apontamentos: [],
        };
      }
      acc[key].apontamentos.push(ap);
      return acc;
    }, {});
  }, [apontamentosFiltrados]);

  useEffect(() => {
    const calcularPerformance = () => {
      const stats = tecnicos.map(tecnico => {
        const apontamentosDoTecnico = apontamentos.filter(
          ap => ap.tecnico_id === tecnico.id
        );
        
        const tempoTotalSegundos = apontamentosDoTecnico.reduce(
          (acc, ap) => acc + (ap.duracao || 0), 0
        );

        return {
          id: tecnico.id,
          nome: tecnico.nome,
          tempoTotalMinutos: Math.round(tempoTotalSegundos / 60), // Dado para o gráfico
        };
      });
      setPerformanceTecnicos(stats);
    };
    
    if (apontamentos.length > 0 && tecnicos.length > 0) {
        calcularPerformance();
    }
  }, [apontamentos, tecnicos]);

  const getStatusColor = (status) => {
    switch (status) {
      case "concluido": return "bg-green-100 text-green-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTempo = (segundos) => {
    if (!segundos || segundos < 0) return "0 min";
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.round((segundos % 3600) / 60);
    if (horas > 0) return `${horas}h ${minutos}min`;
    return `${minutos} min`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Relatório de Apontamentos</h1>
          </div>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={tecnicoSelecionado} onValueChange={setTecnicoSelecionado}>
                <SelectTrigger><SelectValue placeholder="Filtrar por técnico" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os técnicos</SelectItem>
                  {tecnicos.map(t => <SelectItem key={t.id} value={t.nome}>{t.nome}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="concluido">Concluídos</SelectItem>
                  <SelectItem value="em andamento">Em andamento</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" />Apontamentos por Chamado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {Object.keys(groupedApontamentos).length > 0 ? Object.entries(groupedApontamentos).map(([chamadoId, grupo]) => (
                    <div key={chamadoId} className="p-4 border rounded-lg bg-white">
                      <h3 className="font-bold text-md mb-3 text-gray-800 border-b pb-2">
                        {grupo.chamadoTitulo}
                      </h3>
                      <div className="space-y-3">
                        {grupo.apontamentos.map(apont => (
                           <div key={apont.id} className="p-3 border-l-4 border-blue-500 bg-gray-50 rounded-r-md">
                             <div className="flex items-start justify-between mb-2">
                               <p className="text-sm text-gray-700 flex-1 pr-4">{apont.descricao}</p>
                               <Badge className={`${getStatusColor(apont.status)} self-start`}>{apont.status}</Badge>
                             </div>
                             <div className="flex items-center justify-between text-xs text-gray-500">
                               <span className="flex items-center gap-1.5"><Users className="h-3 w-3" />{apont.tecnicoNome}</span>
                               <span className="flex items-center gap-1.5 font-medium"><Clock className="h-3 w-3" />{formatTempo(apont.duracao)}</span>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-500 py-8">Nenhum apontamento encontrado para os filtros selecionados.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Performance dos Técnicos</CardTitle>
                  <CardDescription>Tempo total trabalhado (em minutos)</CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceChart data={performanceTecnicos} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}