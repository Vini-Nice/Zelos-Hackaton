"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText, Search, Eye, Clock, CheckCircle, AlertTriangle, XCircle, User, Calendar
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";

export default function ChamadosUsuarios() {
  const router = useRouter();
  const [chamados, setChamados] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [updatingId, setUpdatingId] = useState(null);
  const [focusedChamadoId, setFocusedChamadoId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [chamadosResponse, usuariosResponse] = await Promise.all([
        apiRequest("/api/chamados"),
        apiRequest("/api/usuarios"),
      ]);
      const chamadosData = Array.isArray(chamadosResponse) ? chamadosResponse : [];
      setChamados(chamadosData);

      const usuariosData = Array.isArray(usuariosResponse) ? usuariosResponse : [];
      const map = usuariosData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
      setUserMap(map);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFocusChamado = (chamadoId) => {
    const newFocusedId = focusedChamadoId === chamadoId ? null : chamadoId;
    setFocusedChamadoId(newFocusedId);

    if (newFocusedId) {
      setTimeout(() => {
        const element = document.getElementById(`chamado-${newFocusedId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
    }
  };
  
  const handleStatusChange = async (chamadoId, newStatus) => {
    try {
      setUpdatingId(chamadoId);
      await apiRequest(`/api/chamados/${chamadoId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setChamados(prev =>
        prev.map(c => (c.id === chamadoId ? { ...c, status: newStatus } : c))
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredChamados = useMemo(() => {
    return chamados.filter(chamado => {
      const solicitante = userMap[chamado.usuario_id];
      const matchesSearch =
        chamado.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solicitante?.nome?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "todos" || chamado.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [chamados, searchTerm, filterStatus, userMap]);

  const stats = useMemo(() => ({
    total: chamados.length,
    pendentes: chamados.filter(c => c.status === "pendente").length,
    emAndamento: chamados.filter(c => c.status === "em andamento").length,
    concluidos: chamados.filter(c => c.status === "concluido" || c.status === "concluído").length,
    cancelados: chamados.filter(c => c.status === "cancelado").length,
  }), [chamados]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Gerenciar Chamados</h1>
          </div>
        </div>
      </header>
      <div className="p-6 md:p-10 space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pendentes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.pendentes}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Em Andamento</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.emAndamento}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Concluídos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.concluidos}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Cancelados</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.cancelados}</p></CardContent></Card>
          </div>

          <Card>
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por título, descrição ou solicitante..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="em andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluídos</SelectItem>
                    <SelectItem value="cancelado">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
                <div className="hidden md:flex items-center justify-center bg-muted text-muted-foreground rounded-lg px-4 text-sm font-medium">
                  {filteredChamados.length} encontrados
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chamados do Sistema</CardTitle>
              <CardDescription>Lista de todos os chamados registrados. Clique no olho para focar.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 font-semibold text-sm">Chamado</th>
                      <th className="py-3 px-4 font-semibold text-sm">Solicitante</th>
                      <th className="py-3 px-4 font-semibold text-sm">Data</th>
                      <th className="py-3 px-4 font-semibold text-sm">Status</th>
                      <th className="py-3 px-4 font-semibold text-sm text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChamados.length > 0 ? (
                      filteredChamados.map((chamado) => {
                        const isFocused = focusedChamadoId === chamado.id;
                        return (
                          <tr key={chamado.id} id={`chamado-${chamado.id}`} className={`border-b transition-colors ${isFocused ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted/50'}`}>
                            <td className="py-3 px-4">
                              <p className="font-medium text-sm">{chamado.titulo}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-xs">{chamado.descricao}</p>
                            </td>
                            <td className="py-3 px-4 text-sm">{userMap[chamado.usuario_id]?.nome || 'N/A'}</td>
                            <td className="py-3 px-4 text-sm">{new Date(chamado.criado_em).toLocaleDateString("pt-BR")}</td>
                            <td className="py-3 px-4">
                              <Select value={chamado.status} onValueChange={(value) => handleStatusChange(chamado.id, value)} disabled={updatingId === chamado.id}>
                                <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pendente">Pendente</SelectItem>
                                  <SelectItem value="em andamento">Em Andamento</SelectItem>
                                  <SelectItem value="concluido">Concluído</SelectItem>
                                  <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleFocusChamado(chamado.id)} aria-label="Focar no chamado">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-muted-foreground">Nenhum chamado encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
      </div>
    </DashboardLayout>
  );
}