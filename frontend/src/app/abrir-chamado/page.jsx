"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

export default function AbrirChamadoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pools, setPools] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo_id: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const poolsData = await apiRequest("/api/pools");
        setPools(Array.isArray(poolsData) ? poolsData : poolsData?.data || []);
      } catch (error) {
        console.error("Erro ao carregar tipos de chamado:", error);
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
        status: "pendente"
      };

      await apiRequest("/api/chamados", {
        method: "POST",
        body: JSON.stringify(chamadoData)
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPoolDisplayName = (titulo) => {
    const displayNames = {
      'externo': 'Externo',
      'manutencao': 'Manutenção',
      'apoio_tecnico': 'Apoio Técnico',
      'limpeza': 'Limpeza'
    };
    return displayNames[titulo] || titulo;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Abrir Novo Chamado</h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tipo de Chamado *
                </label>
                <select
                  name="tipo_id"
                  value={formData.tipo_id}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
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
                <label className="block text-gray-700 font-medium mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? "Abrindo Chamado..." : "Abrir Chamado"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:bg-gray-100"
                >
                  Cancelar
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Dicas para um bom chamado:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Seja específico no título e descrição</li>
                <li>• Inclua informações sobre quando o problema começou</li>
                <li>• Mencione se o problema é recorrente</li>
                <li>• Adicione screenshots se necessário</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
