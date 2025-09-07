"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, AlertCircle, CheckCircle, Wrench, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

export default function AbrirChamadoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pools, setPools] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo_id: "",
    patrimonio: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const poolsData = await apiRequest("/api/pools");
        setPools(Array.isArray(poolsData) ? poolsData : []);
      } catch (error) {
        console.error("Erro ao carregar tipos de chamado:", error);
        setError("Erro ao carregar os tipos de chamado. Tente novamente.");
      }
    };
    fetchPools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descricao || !formData.tipo_id) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest("/api/chamados", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          usuario_id: user.id,
          status: "pendente",
        }),
      });
      setSuccess("Chamado aberto com sucesso! Você será redirecionado.");
      setFormData({ titulo: "", descricao: "", tipo_id: "" });
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      setError(error.message || "Ocorreu um erro ao abrir o chamado.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, tipo_id: value }));
  };

  return (
    <DashboardLayout>
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <Plus className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Abrir Chamado</h1>
          </div>
          <div className="flex items-center space-x-4"></div>
        </div>
      </header>
      <div className="p-6 md:p-10">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Abrir Novo Chamado</CardTitle>
                <CardDescription>
                  Preencha os campos abaixo para criar uma nova solicitação.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-200">
                <AlertCircle className="h-5 w-5" /> {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-200">
                <CheckCircle className="h-5 w-5" /> {success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título do Chamado *</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ex: Computador não liga"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patrimonio">
                  Número de Patrimônio (Opcional)
                </Label>
                <Input
                  id="patrimonio"
                  name="patrimonio"
                  value={formData.patrimonio}
                  onChange={handleInputChange}
                  placeholder="Ex: 123456"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_id">Tipo de Chamado *</Label>
                <Select
                  name="tipo_id"
                  value={formData.tipo_id}
                  onValueChange={handleSelectChange}
                  required
                  disabled={loading}
                >
                  <SelectTrigger id="tipo_id">
                    <SelectValue placeholder="Selecione o tipo de problema" />
                  </SelectTrigger>
                  <SelectContent>
                    {pools.map((pool) => (
                      <SelectItem key={pool.id} value={String(pool.id)}>
                        {pool.titulo.charAt(0).toUpperCase() +
                          pool.titulo.slice(1).replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição Detalhada *</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva com detalhes o que está acontecendo, incluindo mensagens de erro, se houver."
                  required
                  disabled={loading}
                  rows={6}
                />
              </div>
              <CardFooter className="flex gap-4 p-0 pt-6">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Enviando..." : "Abrir Chamado"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
