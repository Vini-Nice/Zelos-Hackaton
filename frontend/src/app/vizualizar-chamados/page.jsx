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
  Wrench
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function VizualizarChamados() {
  const router = useRouter();
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedChamado, setSelectedChamado] = useState(null);
  const [apontamento, setApontamento] = useState("");

  useEffect(() => {
    if (user?.id) fetchChamados();
  }, [user]);

  const fetchChamados = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`/api/chamados?tecnico_id=${user.id}`);
      const data = Array.isArray(response) ? response : response?.data;
      setChamados(data || []);
      if (selectedChamado) {
        const updated = data.find(c => c.id === selectedChamado.id);
        if (updated) setSelectedChamado(updated);
      }
    } catch (err) {
      console.error("Erro ao carregar chamados:", err);
      setError("Não foi possível carregar os chamados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddApontamento = async () => {
    if (!apontamento.trim() || !selectedChamado) return;

    const comeco = new Date().toISOString();

    try {
      const novoApont = {
        chamado_id: selectedChamado.id,
        tecnico_id: user.id,
        descricao: apontamento,
        comeco
      };

      await apiRequest("/api/apontamentos", {
        method: "POST",
        body: JSON.stringify(novoApont)
      });

      setApontamento("");

      setChamados(prev =>
        prev.map(c =>
          c.id === selectedChamado.id
            ? { ...c, apontamentos: [...(c.apontamentos || []), novoApont] }
            : c
        )
      );

      setSelectedChamado(prev => ({
        ...prev,
        apontamentos: [...(prev.apontamentos || []), novoApont]
      }));
    } catch (err) {
      console.error("Erro ao adicionar apontamento:", err);
      setError("Não foi possível adicionar o apontamento.");
    }
  };

  const handleFinalizarChamado = async () => {
    if (!selectedChamado || !selectedChamado.apontamentos?.length) return;

    let duracaoTotal = 0;
    selectedChamado.apontamentos.forEach((apont) => {
      const inicio = new Date(apont.comeco).getTime();
      const fim = apont.fim ? new Date(apont.fim).getTime() : Date.now();
      duracaoTotal += Math.floor((fim - inicio) / 1000);
    });

    try {
      await apiRequest(`/api/chamados/${selectedChamado.id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: "concluido",
          duracao_total: duracaoTotal
        })
      });

      const updatedChamados = chamados.map(c =>
        c.id === selectedChamado.id ? { ...c, status: "concluido", duracao_total: duracaoTotal } : c
      );
      setChamados(updatedChamados);
      setSelectedChamado(prev => ({ ...prev, status: "concluido", duracao_total: duracaoTotal }));
    } catch (err) {
      console.error("Erro ao finalizar chamado:", err);
      setError("Não foi possível finalizar o chamado.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      case "concluido": return "bg-green-100 text-green-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendente": return <Clock className="h-4 w-4" />;
      case "em andamento": return <AlertTriangle className="h-4 w-4" />;
      case "concluido": return <CheckCircle className="h-4 w-4" />;
      case "cancelado": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "em andamento": return "Em Andamento";
      case "concluido": return "Concluído";
      case "cancelado": return "Cancelado";
      default: return status;
    }
  };

  const filteredChamados = chamados.filter(chamado => {
    const matchesSearch = chamado.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || chamado.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDuracao = (segundos) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h}h ${m}m ${s}s`;
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="border-b border-border bg-card">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Chamados</h1>
              </div>
              <div className="flex items-center space-x-4">

              </div>
            </div>
          </header>
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="p-4">
              <CardContent className="text-center">
                <h3 className="text-lg font-semibold">Total</h3>
                <p className="text-2xl font-bold">{chamados.length}</p>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardContent className="text-center">
                <h3 className="text-lg font-semibold">Pendentes</h3>
                <p className="text-2xl font-bold">{chamados.filter(c => c.status === "pendente").length}</p>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardContent className="text-center">
                <h3 className="text-lg font-semibold">Em Andamento</h3>
                <p className="text-2xl font-bold">{chamados.filter(c => c.status === "em andamento").length}</p>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardContent className="text-center">
                <h3 className="text-lg font-semibold">Concluídos</h3>
                <p className="text-2xl font-bold">{chamados.filter(c => c.status === "concluido").length}</p>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardContent className="text-center">
                <h3 className="text-lg font-semibold">Cancelados</h3>
                <p className="text-2xl font-bold">{chamados.filter(c => c.status === "cancelado").length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Filtros */}
              <Card>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar chamados..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="em andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluídos</SelectItem>
                      <SelectItem value="cancelado">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-center bg-gray-100 rounded-lg px-4">
                    <span className="text-sm text-gray-600">
                      {filteredChamados.length} chamado{filteredChamados.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de chamados */}
              <div className="space-y-3">
                {filteredChamados.map((chamado) => (
                  <Card 
                    key={chamado.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedChamado?.id === chamado.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedChamado(chamado)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{chamado.titulo}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{chamado.descricao}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Usuário #{chamado.usuario_id}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`flex items-center gap-1 ${getStatusColor(chamado.status)}`}>
                            {getStatusIcon(chamado.status)}
                            {getStatusLabel(chamado.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Detalhes do chamado */}
            <div className="lg:col-span-1">
              {selectedChamado ? (
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Detalhes do Chamado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{selectedChamado.titulo}</h3>
                      <p className="text-sm text-gray-600 mb-4">{selectedChamado.descricao}</p>
                    </div>

                    {/* Campo para adicionar apontamento */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Adicionar Apontamento</h4>
                      <Textarea
                        placeholder="Descreva o que foi feito..."
                        value={apontamento}
                        onChange={(e) => setApontamento(e.target.value)}
                        rows={3}
                        className="mb-2"
                      />
                      <Button
                        onClick={handleAddApontamento}
                        disabled={!apontamento.trim()}
                        className="w-full mb-2"
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Adicionar Apontamento
                      </Button>
                    </div>

                    {/* Lista de apontamentos */}
                    {selectedChamado.apontamentos && selectedChamado.apontamentos.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Apontamentos</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedChamado.apontamentos.map((apont, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                              <p className="text-gray-700">{apont.descricao}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(apont.comeco).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botão Finalizar */}
                    {selectedChamado.status !== "concluido" && (
                      <Button
                        onClick={handleFinalizarChamado}
                        className="w-full mt-4"
                        size="sm"
                      >
                        Finalizar Chamado
                      </Button>
                    )}

                    {/* Mostrar duração total se finalizado */}
                    {selectedChamado.status === "concluido" && selectedChamado.duracao_total && (
                      <div className="mt-2 text-sm text-gray-600">
                        Duração total do serviço: {formatDuracao(selectedChamado.duracao_total)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Selecione um chamado para ver os detalhes</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
