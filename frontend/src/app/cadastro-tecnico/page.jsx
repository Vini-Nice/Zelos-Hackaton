"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, ArrowLeft, Save, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";

export default function CadastroTecnico() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    funcao: "tecnico"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest("/api/usuarios", {
        method: "POST",
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          funcao: "tecnico"
        })
      });

      if (response.success) {
        setSuccess("Técnico cadastrado com sucesso!");
        setFormData({
          nome: "",
          email: "",
          senha: "",
          confirmarSenha: "",
          funcao: "tecnico"
        });
      } else {
        setError(response.message || "Erro ao cadastrar técnico");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cadastrar Técnico</h1>
              <p className="text-gray-600">Adicione um novo técnico ao sistema</p>
            </div>
          </div>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Informações do Técnico
              </CardTitle>
              <CardDescription>
                Preencha os dados do novo técnico. Todos os campos marcados com * são obrigatórios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Alertas */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <p className="text-green-600 text-sm">{success}</p>
                  </div>
                )}

                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="tecnico@empresa.com"
                    required
                  />
                </div>

                {/* Campos extras removidos por não existirem no banco */}

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                    placeholder="Confirme a senha"
                    required
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {loading ? "Cadastrando..." : "Cadastrar Técnico"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
