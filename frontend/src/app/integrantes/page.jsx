"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  UserPlus,
  UserCheck,
  UserX
} from "lucide-react";
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
  const [showPassword, setShowPassword] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    funcao: "aluno",
    status: "ativo"
  });

  useEffect(() => {
    if (user?.funcao !== 'admin') {
      router.push('/');
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
        body: JSON.stringify(formData)
      });
      setFormData({ nome: "", email: "", senha: "", funcao: "aluno", status: "ativo" });
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
      
      await apiRequest(`/api/usuarios/${userId}`, {
        method: "PUT",
        body: JSON.stringify(updateData)
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
      await apiRequest(`/api/usuarios/${userId}`, {
        method: "DELETE"
      });
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const getFuncaoColor = (funcao) => {
    switch (funcao) {
      case "admin": return "bg-red-100 text-red-800";
      case "tecnico": return "bg-blue-100 text-blue-800";
      case "aluno": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    return status === "ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuncao = filterFuncao === "todos" || usuario.funcao === filterFuncao;
    const matchesStatus = filterStatus === "todos" || usuario.status === filterStatus;
    
    return matchesSearch && matchesFuncao && matchesStatus;
  });

  if (user?.funcao !== 'admin') {
    return null;
  }

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
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
              <p className="text-gray-600">Gerencie todos os usuários do sistema</p>
            </div>
            <Button onClick={() => setFormData({ nome: "", email: "", senha: "", funcao: "aluno", status: "ativo" })}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>

          {/* Formulário de Criação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Criar Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  required
                />
                <Select value={formData.funcao} onValueChange={(value) => setFormData({...formData, funcao: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
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

          {/* Filtros */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterFuncao} onValueChange={setFilterFuncao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as funções</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="aluno">Aluno</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg px-4">
                  <span className="text-sm text-gray-600">
                    {filteredUsuarios.length} usuário{filteredUsuarios.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-900">Usuário</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Função</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Criado em</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsuarios.map((usuario, index) => (
                      <tr
                        key={usuario.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{usuario.nome}</p>
                            <p className="text-sm text-gray-500">ID: {usuario.id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{usuario.email}</td>
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
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingUser(usuario)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(usuario.id)}
                              className="h-8 w-8 p-0 text-red-600"
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
    </DashboardLayout>
  );
}
