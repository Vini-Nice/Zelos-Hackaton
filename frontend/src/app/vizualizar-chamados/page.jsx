"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Search, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  Save,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedChamado, setSelectedChamado] = useState(null);
  const [apontamento, setApontamento] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchChamados();
  }, []);

  const fetchChamados = async () => {
    try {
      // Buscar chamados atribuídos ao técnico ou todos os chamados pendentes
      const response = await apiRequest(`/api/chamados?tecnico_id=${user?.id}`);
      if (response.success) {
        setChamados(response.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (chamadoId, novoStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await apiRequest(`/api/chamados/${chamadoId}`, {
        method: "PUT",
        body: JSON.stringify({
          status: novoStatus
        })
      });
      
      if (response.success) {
        fetchChamados();
        if (selectedChamado?.id === chamadoId) {
          setSelectedChamado({ ...selectedChamado, status: novoStatus });
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddApontamento = async () => {
    if (!apontamento.trim() || !selectedChamado) return;

    try {
      const response = await apiRequest("/api/apontamentos", {
        method: "POST",
        body: JSON.stringify({
          chamado_id: selectedChamado.id,
          tecnico_id: user?.id,
          descricao: apontamento,
          data: new Date().toISOString()
        })
      });

      if (response.success) {
        setApontamento("");
        fetchChamados();
        // Atualizar o chamado selecionado com o novo apontamento
        const updatedChamado = await apiRequest(`/api/chamados/${selectedChamado.id}`);
        if (updatedChamado.success) {
          setSelectedChamado(updatedChamado.data);
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar apontamento:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      case "concluído": return "bg-green-100 text-green-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendente": return <Clock className="h-4 w-4" />;
      case "em andamento": return <AlertTriangle className="h-4 w-4" />;
      case "concluído": return <CheckCircle className="h-4 w-4" />;
      case "cancelado": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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

  const getStatusLabel = (status) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "em andamento": return "Em Andamento";
      case "concluído": return "Concluído";
      case "cancelado": return "Cancelado";
      default: return status;
    }
  };

  const filteredChamados = chamados.filter(chamado => {
    const matchesSearch = chamado.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chamado.usuario_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todos" || chamado.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: chamados.length,
    pendentes: chamados.filter(c => c.status === "pendente").length,
    emAndamento: chamados.filter(c => c.status === "em andamento").length,
    concluidos: chamados.filter(c => c.status === "concluído").length
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
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visualizar Chamados</h1>
              <p className="text-gray-600">Gerencie os chamados atribuídos a você</p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Em Andamento</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.emAndamento}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600">{stats.concluidos}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Chamados */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filtros */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <SelectItem value="concluído">Concluídos</SelectItem>
                        <SelectItem value="cancelado">Cancelados</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center justify-center bg-gray-100 rounded-lg px-4">
                      <span className="text-sm text-gray-600">
                        {filteredChamados.length} chamado{filteredChamados.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista */}
              <div className="space-y-3">
                {filteredChamados.map((chamado) => (
                  <Card 
                    key={chamado.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedChamado?.id === chamado.id ? 'ring-2 ring-blue-500' : ''
                    }`}
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
                              {chamado.usuario_nome}
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
                          <Badge className={getPrioridadeColor(chamado.prioridade)}>
                            {chamado.prioridade}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Detalhes do Chamado */}
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
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Solicitante:</span>
                          <span className="font-medium">{selectedChamado.usuario_nome}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Data:</span>
                          <span>{new Date(selectedChamado.criado_em).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Prioridade:</span>
                          <Badge className={getPrioridadeColor(selectedChamado.prioridade)}>
                            {selectedChamado.prioridade}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Atualizar Status */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Atualizar Status</h4>
                      <Select 
                        value={selectedChamado.status} 
                        onValueChange={(value) => handleStatusUpdate(selectedChamado.id, value)}
                        disabled={updatingStatus}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="em andamento">Em Andamento</SelectItem>
                          <SelectItem value="concluído">Concluído</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Apontamentos */}
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
                        className="w-full"
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Adicionar Apontamento
                      </Button>
                    </div>

                    {/* Lista de Apontamentos */}
                    {selectedChamado.apontamentos && selectedChamado.apontamentos.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Apontamentos</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedChamado.apontamentos.map((apont, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                              <p className="text-gray-700">{apont.descricao}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(apont.data).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          ))}
                        </div>
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
