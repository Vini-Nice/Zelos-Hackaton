"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  UserCheck,
  UserX,
  Wrench
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function Integrantes() {
  const router = useRouter();
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFuncao, setFilterFuncao] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    funcao: "usuario_comum",
    status: "ativo",
  });

  useEffect(() => {
    if (user?.funcao !== "admin") {
      router.push("/");
      return;
    }
    fetchUsuarios();
  }, [user, router]);

  const fetchUsuarios = async () => {
    try {
      const response = await apiRequest("/api/usuarios");
      setUsuarios(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/api/usuarios", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setFormData({ nome: "", email: "", senha: "", funcao: "usuario_comum", status: "ativo" });
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  const handleUpdateUser = async (userId) => {
    try {
      const updateData = { ...editingUser };
      delete updateData.id;
      delete updateData.criado_em;
      delete updateData.atualizado_em;
      if (!updateData.senha) delete updateData.senha;

      await apiRequest(`/api/usuarios/${userId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      setEditingUser(null);
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await apiRequest(`/api/usuarios/${userId}`, { method: "DELETE" });
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const getFuncaoColor = (funcao) => {
    switch (funcao) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "tecnico":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "usuario_comum":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusColor = (status) => {
    return status === "ativo"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuncao =
      filterFuncao === "todos" || usuario.funcao === filterFuncao;
    const matchesStatus =
      filterStatus === "todos" || usuario.status === filterStatus;

    return matchesSearch && matchesFuncao && matchesStatus;
  });

  if (user?.funcao !== "admin") return null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                <Wrench className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Sistema de Manutenção</h1>
              </div>
              <div className="flex items-center space-x-4">

              </div>
            </div>
          </header>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            
          </div>

          {/* Formulário de Criação */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Plus className="h-5 w-5" />
                Criar Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleCreateUser}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Input
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  required
                />
                <Select
                  value={formData.funcao}
                  onValueChange={(value) =>
                    setFormData({ ...formData, funcao: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario_comum">Usuário Comum</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Users className="h-5 w-5" />
                Usuários do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-200">
                        Usuário
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-200">
                        Email
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-200">
                        Função
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-200">
                        Status
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-200">
                        Criado em
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-200">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsuarios.map((usuario, index) => (
                      <tr
                        key={usuario.id}
                        className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {usuario.nome}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {usuario.id}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {usuario.email}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getFuncaoColor(usuario.funcao)}>
                            {usuario.funcao}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(usuario.status)}>
                            {usuario.status === "ativo" ? (
                              <UserCheck className="h-3 w-3 mr-1" />
                            ) : (
                              <UserX className="h-3 w-3 mr-1" />
                            )}
                            {usuario.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {new Date(usuario.criado_em).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingUser({ ...usuario })}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(usuario.id)}
                              className="h-8 w-8 p-0 text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Edição */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Editar Usuário</DialogTitle>
          </DialogHeader>

          {editingUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(editingUser.id);
              }}
              className="space-y-4"
            >
              <Input
                placeholder="Nome completo"
                value={editingUser.nome}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, nome: e.target.value })
                }
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                required
              />
              <Input
                type="password"
                placeholder="Nova senha (opcional)"
                value={editingUser.senha || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, senha: e.target.value })
                }
              />
              <Select
                value={editingUser.funcao}
                onValueChange={(value) =>
                  setEditingUser({ ...editingUser, funcao: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuario_comum">Usuário Comum</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editingUser.status}
                onValueChange={(value) =>
                  setEditingUser({ ...editingUser, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>

              <DialogFooter>
                <Button type="submit" className="bg-blue-600 dark:bg-blue-500 text-white">
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
