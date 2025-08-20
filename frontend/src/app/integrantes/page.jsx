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
  Edit, 
  Trash2, 
  UserPlus, 
  Filter,
  MoreHorizontal,
  Eye
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";

export default function Integrantes() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFuncao, setFilterFuncao] = useState("todos");
  const [filterDepartamento, setFilterDepartamento] = useState("todos");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await apiRequest("/api/usuarios");
      if (response.success) {
        setUsuarios(response.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const response = await apiRequest(`/api/usuarios/${id}`, {
          method: "DELETE"
        });
        if (response.success) {
          fetchUsuarios();
        }
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
    }
  };

  const getFuncaoColor = (funcao) => {
    switch (funcao) {
      case "admin": return "bg-red-100 text-red-800";
      case "tecnico": return "bg-blue-100 text-blue-800";
      case "usuario": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFuncaoLabel = (funcao) => {
    switch (funcao) {
      case "admin": return "Administrador";
      case "tecnico": return "Técnico";
      case "usuario": return "Usuário";
      default: return funcao;
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.matricula?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFuncao = filterFuncao === "todos" || usuario.funcao === filterFuncao;
    const matchesDepartamento = filterDepartamento === "todos" || usuario.departamento === filterDepartamento;
    
    return matchesSearch && matchesFuncao && matchesDepartamento;
  });

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
              <p className="text-gray-600">Visualize e gerencie todos os usuários do sistema</p>
            </div>
            <Button
              onClick={() => router.push("/cadastro-usuario")}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </div>

          {/* Filtros e Busca */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filtro por Função */}
                <Select value={filterFuncao} onValueChange={setFilterFuncao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as funções</SelectItem>
                    <SelectItem value="admin">Administradores</SelectItem>
                    <SelectItem value="tecnico">Técnicos</SelectItem>
                    <SelectItem value="usuario">Usuários</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtro por Departamento */}
                <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os departamentos</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Operações">Operações</SelectItem>
                    <SelectItem value="Administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>

                {/* Contador */}
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
              <CardDescription>
                Lista completa de todos os usuários cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-900">Nome</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Matrícula</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Função</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Departamento</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Telefone</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsuarios.length > 0 ? (
                      filteredUsuarios.map((usuario, index) => (
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
                          <td className="py-3 px-4 text-gray-700">{usuario.matricula}</td>
                          <td className="py-3 px-4">
                            <Badge className={getFuncaoColor(usuario.funcao)}>
                              {getFuncaoLabel(usuario.funcao)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{usuario.departamento}</td>
                          <td className="py-3 px-4 text-gray-700">{usuario.telefone || "-"}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/perfil/${usuario.id}`)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/editar-usuario/${usuario.id}`)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(usuario.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-gray-500">
                          Nenhum usuário encontrado
                        </td>
                      </tr>
                    )}
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
