"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  Wrench,
  UserCheck
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function VizualizarChamados() {
  const router = useRouter();
  const { user } = useAuth();

  const [chamados, setChamados] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [selectedChamado, setSelectedChamado] = useState(null);
  const [apontamento, setApontamento] = useState("");

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([fetchChamados(), fetchTipos(), fetchUsuarios()])
        .catch((err) => {
          console.error("Erro ao carregar dados iniciais:", err);
          setError("Não foi possível carregar os dados. Tente novamente.");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const fetchChamados = async () => {
    const response = await apiRequest(`/api/chamados`);
    const data = Array.isArray(response) ? response : response?.data;
    setChamados(data || []);
  };

  const fetchTipos = async () => {
    const response = await apiRequest("/api/pools");
    const data = Array.isArray(response) ? response : response?.data;
    setTipos(data || []);
  };

  const fetchUsuarios = async () => {
    const response = await apiRequest("/api/usuarios");
    const data = Array.isArray(response) ? response : response?.data;
    setUsuarios(data || []);
  };

  // --- FUNÇÃO DE APONTAMENTO CORRIGIDA ---
  const handleAddApontamento = async () => {
    if (!apontamento.trim() || !selectedChamado) return;

    try {
      const novoApont = {
        chamado_id: selectedChamado.id,
        tecnico_id: user.id,
        descricao: apontamento,
        comeco: new Date().toISOString()
      };
      
      // 1. Salva o novo apontamento no banco.
      await apiRequest("/api/apontamentos", { method: "POST", body: JSON.stringify(novoApont) });

      setApontamento(""); // Limpa o campo de texto.

      // 2. Busca a lista FRESCA E COMPLETA de chamados do backend.
      // Graças à correção no backend, esta lista agora contém o novo apontamento.
      const response = await apiRequest(`/api/chamados`);
      const updatedChamadosList = Array.isArray(response) ? response : (response?.data || []);

      // 3. Atualiza a lista principal de chamados na tela.
      setChamados(updatedChamadosList);

      // 4. Encontra a versão mais recente do chamado que está selecionado na lista atualizada.
      const updatedSelectedChamado = updatedChamadosList.find(c => c.id === selectedChamado.id);

      // 5. Atualiza o painel de detalhes para exibir o chamado com o novo apontamento.
      if (updatedSelectedChamado) {
        setSelectedChamado(updatedSelectedChamado);
      }

    } catch (err) {
      console.error("Erro ao adicionar apontamento:", err);
      setError("Não foi possível adicionar o apontamento. Tente novamente.");
    }
  };

  const handleFinalizarChamado = async () => {
    if (!selectedChamado) return;
    try {
      await apiRequest(`/api/chamados/${selectedChamado.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "concluido" })
      });
      const updatedChamados = chamados.map(c =>
        c.id === selectedChamado.id ? { ...c, status: "concluido" } : c
      );
      setChamados(updatedChamados);
      setSelectedChamado(prev => ({ ...prev, status: "concluido" }));
    } catch (err) {
      console.error("Erro ao finalizar chamado:", err);
      setError("Não foi possível finalizar o chamado.");
    }
  };

  const getStatusColor = (status) => ({ "pendente": "bg-yellow-100 text-yellow-800", "em andamento": "bg-blue-100 text-blue-800", "concluido": "bg-green-100 text-green-800", "cancelado": "bg-red-100 text-red-800" }[status] || "bg-gray-100 text-gray-800");
  const getStatusIcon = (status) => ({ "pendente": <Clock className="h-4 w-4" />, "em andamento": <AlertTriangle className="h-4 w-4" />, "concluido": <CheckCircle className="h-4 w-4" />, "cancelado": <XCircle className="h-4 w-4" /> }[status] || <Clock className="h-4 w-4" />);
  const getStatusLabel = (status) => ({ "pendente": "Pendente", "em andamento": "Em Andamento", "concluido": "Concluído", "cancelado": "Cancelado" }[status] || status);
  const getUsuarioNome = (id) => usuarios.find(u => u.id === id)?.nome || `ID #${id}`;
  const getTipoTitulo = (id) => tipos.find(t => t.id === id)?.titulo || 'Desconhecido';
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  const filteredChamados = chamados.filter(chamado => {
    const matchesSearch = chamado.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || chamado.status === filterStatus;
    const matchesTipo = filterTipo === "todos" || chamado.tipo_id == filterTipo;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  if (loading) return <DashboardLayout><div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="min-h-screen flex items-center justify-center text-red-500 font-bold p-4 text-center">{error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Todos os Chamados</h1>
          </div>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card><CardContent className="p-4 text-center"><h3 className="text-lg font-semibold">Total</h3><p className="text-2xl font-bold">{chamados.length}</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><h3 className="text-lg font-semibold">Pendentes</h3><p className="text-2xl font-bold">{chamados.filter(c => c.status === "pendente").length}</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><h3 className="text-lg font-semibold">Em Andamento</h3><p className="text-2xl font-bold">{chamados.filter(c => c.status === "em andamento").length}</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><h3 className="text-lg font-semibold">Concluídos</h3><p className="text-2xl font-bold">{chamados.filter(c => c.status === "concluido").length}</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><h3 className="text-lg font-semibold">Cancelados</h3><p className="text-2xl font-bold">{chamados.filter(c => c.status === "cancelado").length}</p></CardContent></Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Buscar por título ou descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger><SelectValue placeholder="Filtrar por status" /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="pendente">Pendentes</SelectItem><SelectItem value="em andamento">Em Andamento</SelectItem><SelectItem value="concluido">Concluídos</SelectItem><SelectItem value="cancelado">Cancelados</SelectItem></SelectContent></Select>
                  <Select value={filterTipo} onValueChange={setFilterTipo}><SelectTrigger><SelectValue placeholder="Filtrar por tipo" /></SelectTrigger><SelectContent><SelectItem value="todos">Todos os tipos</SelectItem>{tipos.map(tipo => (<SelectItem key={tipo.id} value={String(tipo.id)}>{capitalize(tipo.titulo)}</SelectItem>))}</SelectContent></Select>
                </CardContent>
              </Card>
              <div className="space-y-3">
                {filteredChamados.length > 0 ? (filteredChamados.map((chamado) => (
                    <Card key={chamado.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedChamado?.id === chamado.id ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setSelectedChamado(chamado)}>
                        <CardContent className="p-4"><div className="flex items-start justify-between"><div className="flex-1 pr-4"><h3 className="font-semibold text-gray-900 mb-1">{chamado.titulo}</h3><p className="text-sm text-gray-600 mb-2 line-clamp-2">{chamado.descricao}</p><div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500"><span className="flex items-center gap-1"><User className="h-3 w-3" /> Solicitante: {getUsuarioNome(chamado.usuario_id)}</span><span className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> Técnico: {getUsuarioNome(chamado.tecnico_id)}</span><span className="flex items-center gap-1"><Wrench className="h-3 w-3" />{capitalize(getTipoTitulo(chamado.tipo_id))}</span><span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(chamado.criado_em).toLocaleDateString('pt-BR')}</span></div></div><div className="flex flex-col items-end gap-2"><Badge className={`flex items-center gap-1 ${getStatusColor(chamado.status)}`}>{getStatusIcon(chamado.status)}{getStatusLabel(chamado.status)}</Badge></div></div></CardContent>
                    </Card>
                ))) : (<Card><CardContent className="p-6 text-center text-gray-500">Nenhum chamado encontrado.</CardContent></Card>)}
              </div>
            </div>
            <div className="lg:col-span-1">
              {selectedChamado ? (
                <Card className="sticky top-6">
                  <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Detalhes do Chamado</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><h3 className="font-semibold text-lg text-gray-900 mb-1">{selectedChamado.titulo}</h3><p className="text-sm text-gray-600">{selectedChamado.descricao}</p></div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Adicionar Apontamento</h4>
                      <Textarea placeholder="Descreva o que foi feito..." value={apontamento} onChange={(e) => setApontamento(e.target.value)} rows={3} className="mb-2" />
                      <Button onClick={handleAddApontamento} disabled={!apontamento.trim()} className="w-full" size="sm"><MessageSquare className="h-4 w-4 mr-2" />Adicionar</Button>
                    </div>
                    {selectedChamado.apontamentos && selectedChamado.apontamentos.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Histórico de Apontamentos</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-md">
                          {selectedChamado.apontamentos.map((apont, index) => (
                            <div key={index} className="p-2 border-b text-sm"><p className="text-gray-700">{apont.descricao}</p><p className="text-xs text-gray-500 mt-1">por {getUsuarioNome(apont.tecnico_id)} em {new Date(apont.comeco).toLocaleString('pt-BR')}</p></div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedChamado.status !== "concluido" && selectedChamado.status !== "cancelado" && (<Button onClick={handleFinalizarChamado} className="w-full mt-4 bg-green-600 hover:bg-green-700" size="sm"><CheckCircle className="h-4 w-4 mr-2"/>Finalizar Chamado</Button>)}
                  </CardContent>
                </Card>
              ) : (<Card><CardContent className="p-6 text-center"><FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500">Selecione um chamado para ver os detalhes.</p></CardContent></Card>)}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}