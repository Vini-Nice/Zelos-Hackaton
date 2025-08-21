"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, User, Mail, Calendar, Shield, Save, X } from "lucide-react";

export default function Perfil() {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ 
    nome: "", 
    email: "", 
    senha: "",
    funcao: "",
    status: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const data = await apiRequest(`/api/usuarios/${user.id}`);
        setUsuario(data);
        setForm({ 
          nome: data.nome, 
          email: data.email, 
          senha: "",
          funcao: data.funcao,
          status: data.status
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const updateData = { ...form };
      if (!updateData.senha) {
        delete updateData.senha;
      }
      delete updateData.funcao; // Não permitir alterar função
      delete updateData.status; // Não permitir alterar status
      
      await apiRequest(`/api/usuarios/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(updateData)
      });
      setEditando(false);
      setUsuario({ ...usuario, nome: form.nome, email: form.email });
      setForm({ ...form, senha: "" }); // Limpar senha após salvar
    } catch (error) {
      console.error(error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Meu Perfil</h1>
                <p className="text-gray-600 dark:text-gray-400">Gerencie suas informações pessoais</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações do Usuário */}
                <Card className="dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <User className="h-5 w-5" />
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Dados básicos da sua conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{usuario?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Função</p>
                        <Badge className={getFuncaoColor(usuario?.funcao)}>
                          {usuario?.funcao}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                        <Badge className={getStatusColor(usuario?.status)}>
                          {usuario?.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Membro desde</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(usuario?.criado_em)}
                        </p>
                      </div>
                    </div>
                    
                    {usuario?.atualizado_em && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Última atualização</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {formatDate(usuario?.atualizado_em)}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Formulário de Edição */}
                <Card className="dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      {editando ? "Editar Informações" : "Informações Editáveis"}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {editando ? "Modifique suas informações" : "Clique em editar para modificar"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!editando ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-gray-500 dark:text-gray-400">Nome</Label>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{usuario?.nome}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-500 dark:text-gray-400">Senha</Label>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {showPassword ? "••••••••" : "••••••••"}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              className="h-6 w-6 p-0"
                            >
                              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => setEditando(true)}
                          className="w-full"
                        >
                          Editar Perfil
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
                        <div>
                          <Label htmlFor="nome" className="text-gray-700 dark:text-gray-300">Nome</Label>
                          <Input
                            id="nome"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            className="mt-1 dark:bg-gray-700 dark:text-gray-100"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 dark:bg-gray-700 dark:text-gray-100"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="senha" className="text-gray-700 dark:text-gray-300">
                            Nova Senha (deixe em branco para manter a atual)
                          </Label>
                          <Input
                            id="senha"
                            name="senha"
                            type="password"
                            value={form.senha}
                            onChange={handleChange}
                            className="mt-1 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Nova senha (opcional)"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setEditando(false);
                              setForm({ 
                                nome: usuario.nome, 
                                email: usuario.email, 
                                senha: "",
                                funcao: usuario.funcao,
                                status: usuario.status
                              });
                            }}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
