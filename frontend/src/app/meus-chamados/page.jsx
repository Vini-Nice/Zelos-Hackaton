"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, AlertCircle, Eye, Plus, MessageSquare } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import ChatModal from "@/components/ChatModal/ChatModal";

// Mapeamento de status para cores e ícones
const statusConfig = {
  pendente: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Icon: Clock,
  },
  "em andamento": {
    label: "Em Andamento",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Icon: AlertCircle,
  },
  concluido: {
    label: "Concluído",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Icon: CheckCircle,
  },
};

export default function MeusChamadosPage() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [chamadosData, tiposData] = await Promise.all([
          apiRequest(`/api/chamados?usuario_id=${user.id}`),
          apiRequest(`/api/pools`)
        ]);
        setChamados(Array.isArray(chamadosData) ? chamadosData : []);
        setTipos(Array.isArray(tiposData) ? tiposData : []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getTipoTitulo = (tipoId) => {
    const tipo = tipos.find(t => t.id === tipoId);
    if (!tipo) return 'Desconhecido';
    return tipo.titulo.charAt(0).toUpperCase() + tipo.titulo.slice(1);
  };

  const filteredChamados = chamados.filter((chamado) => {
    if (filter === "todos") return true;
    return chamado.status === filter;
  });

  const stats = {
    total: chamados.length,
    pendentes: chamados.filter((c) => c.status === "pendente").length,
    emAndamento: chamados.filter((c) => c.status === "em andamento").length,
    concluidos: chamados.filter((c) => c.status === "concluido").length,
  };

  const handleOpenChat = (chamado) => {
    setSelectedChat({
      chamadoId: chamado.id,
      receiverId: chamado.tecnico_id,
      receiverName: 'Técnico',
    });
    setIsChatOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center bg-background dark:bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="border-b border-border bg-card dark:bg-gray-800 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold text-foreground dark:text-gray-100">Meus Chamados</h1>
            </div>
            <Button asChild>
              <Link href="/abrir-chamado" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Abrir Novo Chamado
              </Link>
            </Button>
          </div>
        </header>

        <main className="p-6 md:p-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="dark:bg-gray-800"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
            <Card className="dark:bg-gray-800"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pendentes</p><p className="text-2xl font-bold">{stats.pendentes}</p></CardContent></Card>
            <Card className="dark:bg-gray-800"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Em Andamento</p><p className="text-2xl font-bold">{stats.emAndamento}</p></CardContent></Card>
            <Card className="dark:bg-gray-800"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Concluídos</p><p className="text-2xl font-bold">{stats.concluidos}</p></CardContent></Card>
          </div>

          <Card className="dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setFilter("todos")} variant={filter === "todos" ? "default" : "outline"}>Todos ({stats.total})</Button>
                <Button onClick={() => setFilter("pendente")} variant={filter === "pendente" ? "default" : "outline"}>Pendentes ({stats.pendentes})</Button>
                <Button onClick={() => setFilter("em andamento")} variant={filter === "em andamento" ? "default" : "outline"}>Em Andamento ({stats.emAndamento})</Button>
                <Button onClick={() => setFilter("concluido")} variant={filter === "concluido" ? "default" : "outline"}>Concluídos ({stats.concluidos})</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardContent className="p-0">
              {filteredChamados.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium">Chamado</th>
                        <th className="px-6 py-3 text-left font-medium">Status</th>
                        <th className="px-6 py-3 text-left font-medium">Data</th>
                        <th className="px-6 py-3 text-left font-medium">Tipo</th>
                        <th className="px-6 py-3 text-left font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredChamados.map((chamado) => {
                        const config = statusConfig[chamado.status] || { label: chamado.status, color: "bg-gray-100 text-gray-800", Icon: FileText };
                        return (
                          <tr key={chamado.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-foreground dark:text-gray-100">{chamado.titulo}</p>
                              <p className="text-muted-foreground dark:text-gray-400 truncate max-w-xs">{chamado.descricao}</p>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`inline-flex items-center gap-1.5 ${config.color}`}>
                                <config.Icon className="h-3 w-3" />
                                {config.label}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground dark:text-gray-400">{new Date(chamado.criado_em).toLocaleDateString("pt-BR")}</td>
                            <td className="px-6 py-4 text-muted-foreground dark:text-gray-400">{getTipoTitulo(chamado.tipo_id)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" title="Ver detalhes" asChild>
                                  <Link href={`/chamado/${chamado.id}`}><Eye className="h-4 w-4" /></Link>
                                </Button>
                                {chamado.tecnico_id && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Conversar com o técnico"
                                    onClick={() => handleOpenChat(chamado)}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Nenhum chamado encontrado</h3>
                  <p className="text-muted-foreground mb-6">
                    {filter === "todos" ? "Você ainda não abriu nenhum chamado." : `Não há chamados com o status "${statusConfig[filter]?.label || filter}".`}
                  </p>
                  <Button asChild>
                    <Link href="/abrir-chamado">Abrir Primeiro Chamado</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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