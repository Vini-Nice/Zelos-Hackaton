"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, CheckCircle, Moon, Sun } from "lucide-react";
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
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    const fetchPools = async () => {
      try {
        const poolsData = await apiRequest("/api/pools");
        setPools(Array.isArray(poolsData) ? poolsData : poolsData?.data || []);
      } catch (error) {
        console.error("Erro ao carregar tipos de chamado:", error);
        setError("Erro ao carregar tipos de chamado");
      }
    };

    fetchPools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const chamadoData = {
        ...formData,
        usuario_id: user.id,
        status: "pendente",
      };

      await apiRequest("/api/chamados", {
        method: "POST",
        body: JSON.stringify(chamadoData),
      });

      setSuccess("Chamado aberto com sucesso!");
      setFormData({ titulo: "", descricao: "", tipo_id: "" });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setError(error.message || "Erro ao abrir chamado");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getPoolDisplayName = (titulo) => {
    const displayNames = {
      externo: "Externo",
      manutencao: "Manutenção",
      apoio_tecnico: "Apoio Técnico",
      limpeza: "Limpeza",
    };
    return displayNames[titulo] || titulo;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background dark:bg-gray-900">
        {/* Header */}
        <header className="border-b border-border bg-card dark:bg-gray-800 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary dark:text-primary/80" />
              <h1 className="text-xl font-bold text-foreground dark:text-gray-100">Abrir Novo Chamado</h1>
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
          <Card className="max-w-4xl mx-auto dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-800 dark:text-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-foreground dark:text-gray-100 font-medium mb-2">
                    Título do Chamado *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Descreva brevemente o problema"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-primary/80 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-foreground dark:text-gray-100 font-medium mb-2">
                    Tipo de Chamado *
                  </label>
                  <select
                    name="tipo_id"
                    value={formData.tipo_id}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-primary/80 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  >
                    <option value="">Selecione o tipo</option>
                    {pools.map((pool) => (
                      <option key={pool.id} value={pool.id}>
                        {getPoolDisplayName(pool.titulo)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-foreground dark:text-gray-100 font-medium mb-2">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva detalhadamente o problema, incluindo passos para reproduzir, se aplicável"
                    required
                    disabled={loading}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-primary/80 disabled:bg-gray-100 dark:disabled:bg-gray-600 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70 disabled:bg-primary/50 dark:disabled:bg-primary/40 disabled:cursor-not-allowed"
                  >
                    {loading ? "Abrindo Chamado..." : "Abrir Chamado"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/")}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-300 text-foreground dark:border-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Dicas para um bom chamado:</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Seja específico no título e descrição</li>
                  <li>• Inclua informações sobre quando o problema começou</li>
                  <li>• Mencione se o problema é recorrente</li>
                  <li>• Adicione screenshots se necessário</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}