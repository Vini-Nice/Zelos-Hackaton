"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield, Save, X, Moon, Sun } from "lucide-react";

export default function Perfil() {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    funcao: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Aplicar tema ao carregar
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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
          status: data.status,
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
        body: JSON.stringify(updateData),
      });
      setEditando(false);
      setUsuario({ ...usuario, nome: form.nome, email: form.email });
      setForm({ ...form, senha: "" }); // Limpar senha após salvar
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getFuncaoColor = (funcao) => {
    switch (funcao) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "tecnico":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "aluno":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status) => {
    return status === "ativo"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background dark:bg-gray-900">
        {/* Header */}
        <header className="border-b border-border bg-card dark:bg-gray-800 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-primary dark:text-primary/80" />
              <h1 className="text-xl font-bold text-foreground dark:text-gray-100">Meu Perfil</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Informações do Usuário */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Email</p>
                        <p className="font-medium text-foreground dark:text-gray-100">{usuario?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Função</p>
                        <Badge className={getFuncaoColor(usuario?.funcao)}>{usuario?.funcao}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Status</p>
                        <Badge className={getStatusColor(usuario?.status)}>{usuario?.status}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Membro desde</p>
                        <p className="font-medium text-foreground dark:text-gray-100">
                          {formatDate(usuario?.criado_em)}
                        </p>
                      </div>
                    </div>

                    {usuario?.atualizado_em && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">Última atualização</p>
                          <p className="font-medium text-foreground dark:text-gray-100">
                            {formatDate(usuario?.atualizado_em)}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Formulário de Edição */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    {!editando ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-muted-foreground dark:text-gray-400">Nome</Label>
                          <p className="font-medium text-foreground dark:text-gray-100">{usuario?.nome}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-muted-foreground dark:text-gray-400">Senha</Label>
                          <p className="font-medium text-foreground dark:text-gray-100">••••••••</p>
                        </div>

                        <Button
                          onClick={() => setEditando(true)}
                          className="w-full bg-primary text-white hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70"
                        >
                          Editar Perfil
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
                        <div>
                          <Label htmlFor="nome" className="text-foreground dark:text-gray-100">Nome</Label>
                          <Input
                            id="nome"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            className="mt-1 border-gray-300 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-primary/80"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-foreground dark:text-gray-100">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 border-gray-300 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-primary/80"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="senha" className="text-foreground dark:text-gray-100">
                            Nova Senha (deixe em branco para manter a atual)
                          </Label>
                          <Input
                            id="senha"
                            name="senha"
                            type="password"
                            value={form.senha}
                            onChange={handleChange}
                            className="mt-1 border-gray-300 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-primary/80"
                            placeholder="Nova senha (opcional)"
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button
                            type="submit"
                            className="flex-1 bg-primary text-white hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70"
                          >
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
                                status: usuario.status,
                              });
                            }}
                            className="flex-1 border-gray-300 text-foreground dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
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
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}