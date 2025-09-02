"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield, Save, X, Moon, Sun, Edit } from "lucide-react";

export default function Perfil() {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  // On component mount, check the system's current theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  // Fetch user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;
      try {
        const data = await apiRequest(`/api/usuarios/${user.id}`);
        setUsuario(data);
        setForm({
          nome: data.nome,
          email: data.email,
          senha: "",
        });
      } catch (e) {
        console.error("Failed to load user data:", e);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [user?.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const updateData = { nome: form.nome, email: form.email };
      if (form.senha) {
        updateData.senha = form.senha;
      }

      await apiRequest(`/api/usuarios/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      
      setUsuario({ ...usuario, nome: form.nome, email: form.email });
      setForm({ ...form, senha: "" });
      setEditando(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <User className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold">Meu Perfil</h1>
            </div>
            <div className="flex items-center space-x-4">
             
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{usuario?.nome}</CardTitle>
                      <CardDescription>{usuario?.email}</CardDescription>
                    </div>
                    {!editando && (
                      <Button onClick={() => setEditando(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="border-t border-border pt-6">
                  {!editando ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Função:</span><Badge variant="outline">{usuario?.funcao}</Badge></div>
                      <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Status:</span><Badge variant={usuario?.status === "ativo" ? "default" : "destructive"}>{usuario?.status}</Badge></div>
                      <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Membro desde:</span><span className="font-medium">{formatDate(usuario?.criado_em)}</span></div>
                      <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Última atualização:</span><span className="font-medium">{formatDate(usuario?.atualizado_em)}</span></div>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome</Label>
                          <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="senha">Nova Senha</Label>
                        <Input id="senha" name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Deixe em branco para manter a atual" />
                      </div>
                      <div className="flex justify-end gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditando(false);
                            setForm({ nome: usuario.nome, email: usuario.email, senha: "" });
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}