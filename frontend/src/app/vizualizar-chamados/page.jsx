"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText, Search, Clock, CheckCircle, AlertTriangle, XCircle, User, Calendar, MessageSquare, Wrench, UserCheck
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import ChatModal from "@/components/ChatModal/ChatModal";

const statusConfig = {
  pendente: {
    label: "Pendente",
    Icon: Clock,
    badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
  },
  "em andamento": {
    label: "Em Andamento",
    Icon: AlertTriangle,
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  },
  concluido: {
    label: "Concluído",
    Icon: CheckCircle,
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
  },
  cancelado: {
    label: "Cancelado",
    Icon: XCircle,
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
  },
};

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([fetchChamados(), fetchTipos(), fetchUsuarios()])
        .catch((err) => {
          console.error("Erro ao carregar dados:", err);
          setError("Não foi possível carregar os dados. Tente novamente.");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const fetchChamados = async () => {
    const response = await apiRequest(`/api/chamados`);
    setChamados(Array.isArray(response) ? response : (response?.data || []));
  };

  const fetchTipos = async () => {
    const response = await apiRequest("/api/pools");
    setTipos(Array.isArray(response) ? response : (response?.data || []));
  };

  const fetchUsuarios = async () => {
    const response = await apiRequest("/api/usuarios");
    setUsuarios(Array.isArray(response) ? response : (response?.data || []));
  };

  const handleAddApontamento = async () => {
    if (!apontamento.trim() || !selectedChamado) return;
    try {
      const novoApont = { chamado_id: selectedChamado.id, tecnico_id: user.id, descricao: apontamento, comeco: new Date().toISOString() };
      await apiRequest("/api/apontamentos", { method: "POST", body: JSON.stringify(novoApont) });
      setApontamento("");
      const updatedList = await apiRequest(`/api/chamados`);
      const updatedChamados = Array.isArray(updatedList) ? updatedList : (updatedList?.data || []);
      setChamados(updatedChamados);
      const updatedSelected = updatedChamados.find(c => c.id === selectedChamado.id);
      if (updatedSelected) setSelectedChamado(updatedSelected);
    } catch (err) {
      console.error("Erro ao adicionar apontamento:", err);
      setError("Não foi possível adicionar o apontamento.");
    }
  };

  const handleFinalizarChamado = async () => {
    if (!selectedChamado) return;
    try {
      await apiRequest(`/api/chamados/${selectedChamado.id}`, { method: "PUT", body: JSON.stringify({ status: "concluido" }) });
      const updatedChamados = chamados.map(c => c.id === selectedChamado.id ? { ...c, status: "concluido" } : c);
      setChamados(updatedChamados);
      setSelectedChamado(prev => ({ ...prev, status: "concluido" }));
    } catch (err) {
      console.error("Erro ao finalizar chamado:", err);
      setError("Não foi possível finalizar o chamado.");
    }
  };

  const getUsuarioNome = (id) => usuarios.find(u => u.id === id)?.nome || `ID #${id}`;
  const getTipoTitulo = (id) => tipos.find(t => t.id === id)?.titulo || 'Desconhecido';
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  const filteredChamados = useMemo(() => chamados.filter(chamado => {
    const matchesSearch = chamado.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || chamado.status === filterStatus;
    const matchesTipo = filterTipo === "todos" || chamado.tipo_id == filterTipo;
    return matchesSearch && matchesStatus && matchesTipo;
  }), [chamados, searchTerm, filterStatus, filterTipo]);

  const handleOpenChat = (chamado) => {
    setSelectedChat({
      chamadoId: chamado.id,
      receiverId: chamado.usuario_id,
      receiverName: getUsuarioNome(chamado.usuario_id)
    });
    setIsChatOpen(true);
  };

  if (loading) return <DashboardLayout><div className="flex h-screen items-center justify-center bg-background"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="flex h-screen items-center justify-center text-destructive font-bold p-4 text-center">{error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <Wrench className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold">Gerenciar Chamados</h1>
            </div>
          </div>
        </header>
        
        <main className="p-6 md:p-10">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{chamados.length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pendentes</p><p className="text-2xl font-bold">{chamados.filter(c => c.status === "pendente").length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Em Andamento</p><p className="text-2xl font-bold">{chamados.filter(c => c.status === "em andamento").length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Concluídos</p><p className="text-2xl font-bold">{chamados.filter(c => c.status === "concluido").length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Cancelados</p><p className="text-2xl font-bold">{chamados.filter(c => c.status === "cancelado").length}</p></CardContent></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative sm:col-span-3 lg:col-span-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Status</SelectItem>
                        {Object.entries(statusConfig).map(([status, { label }]) => (
                          <SelectItem key={status} value={status}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterTipo} onValueChange={setFilterTipo}>
                      <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Tipos</SelectItem>
                        {tipos.map(tipo => (<SelectItem key={tipo.id} value={String(tipo.id)}>{capitalize(tipo.titulo)}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  {filteredChamados.length > 0 ? (filteredChamados.map((chamado) => {
                    const config = statusConfig[chamado.status] || { label: chamado.status, Icon: FileText, badgeClass: "bg-gray-100 text-gray-800" };
                    return (
                      <Card key={chamado.id} className={`relative transition-all hover:shadow-lg cursor-pointer ${selectedChamado?.id === chamado.id ? 'ring-2 ring-primary' : 'ring-0'}`} onClick={() => setSelectedChamado(chamado)}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          title="Conversar com o usuário"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenChat(chamado);
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <CardContent className="p-4 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{chamado.titulo}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{chamado.descricao}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {getUsuarioNome(chamado.usuario_id)}</span>
                              <span className="flex items-center gap-1.5"><UserCheck className="h-3 w-3" /> {getUsuarioNome(chamado.tecnico_id)}</span>
                              <span className="flex items-center gap-1.5"><Wrench className="h-3 w-3" /> {capitalize(getTipoTitulo(chamado.tipo_id))}</span>
                              <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          <Badge className={`flex-shrink-0 ${config.badgeClass}`}><config.Icon className="h-3.5 w-3.5 mr-1.5" />{config.label}</Badge>
                        </CardContent>
                      </Card>
                    );
                  })) : (
                    <Card><CardContent className="p-6 text-center text-muted-foreground">Nenhum chamado encontrado com os filtros atuais.</CardContent></Card>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  {selectedChamado ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedChamado.titulo}</CardTitle>
                        <CardDescription>{capitalize(getTipoTitulo(selectedChamado.tipo_id))}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Descrição</h4>
                          <p className="text-sm text-muted-foreground">{selectedChamado.descricao}</p>
                        </div>
                        <div className="border-t border-border pt-4">
                          <h4 className="font-semibold mb-3 text-sm">Adicionar Apontamento</h4>
                          <Textarea placeholder="Descreva o que foi feito..." value={apontamento} onChange={(e) => setApontamento(e.target.value)} rows={3} className="mb-2" />
                          <Button onClick={handleAddApontamento} disabled={!apontamento.trim()} className="w-full" size="sm"><MessageSquare className="h-4 w-4 mr-2" />Adicionar</Button>
                        </div>
                        {selectedChamado.apontamentos && selectedChamado.apontamentos.length > 0 && (
                          <div className="border-t border-border pt-4">
                            <h4 className="font-semibold mb-3 text-sm">Histórico de Apontamentos</h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                              {selectedChamado.apontamentos.map((apont) => (
                                <div key={apont.id} className="text-sm p-3 bg-secondary/50 rounded-md">
                                  <p className="text-foreground">{apont.descricao}</p>
                                  <p className="text-xs text-muted-foreground mt-1.5">por {getUsuarioNome(apont.tecnico_id)} em {new Date(apont.comeco).toLocaleString('pt-BR')}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedChamado.status !== "concluido" && selectedChamado.status !== "cancelado" && (
                          <Button onClick={handleFinalizarChamado} className="w-full bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="h-4 w-4 mr-2"/>Finalizar Chamado</Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="flex flex-col items-center justify-center text-center p-10 h-[calc(100vh-8rem)]">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-semibold">Selecione um Chamado</h3>
                        <p className="text-muted-foreground text-sm mt-1">Os detalhes do chamado selecionado aparecerão aqui.</p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {isChatOpen && selectedChat && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          chamadoId={selectedChat.chamadoId}
          senderId={user.id}
          receiverId={selectedChat.receiverId}
          receiverName={selectedChat.receiverName}
        />
      )}
    </DashboardLayout>
  );
}