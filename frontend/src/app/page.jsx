"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Clock, CheckCircle, HelpCircle, AlertTriangle, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

const acoes = [
  { label: "Abrir Chamado", link: "/abrir-chamado", icon: <FileText className="h-10 w-10 text-blue-600" /> },
  { label: "Acompanhar Chamados", link: "/meus-chamados", icon: <Clock className="h-10 w-10 text-purple-600" /> },
  { label: "Manual / FAQ", link: "/manual", icon: <HelpCircle className="h-10 w-10 text-green-600" /> },
];

const statusColors = {
  "pendente": "bg-yellow-100 text-yellow-800",
  "em andamento": "bg-blue-100 text-blue-800",
  "concluído": "bg-green-100 text-green-800",
};

export default function DashboardUsuario() {
  const { user } = useAuth();
  const [meusChamados, setMeusChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    abertos: 0,
    resolvidos: 0,
    pendentes: 0
  });

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        if (user) {
          const chamados = await apiRequest(`/api/chamados?usuario_id=${user.id}`);
          setMeusChamados(chamados.slice(0, 5)); // Últimos 5 chamados
          
          // Calcular estatísticas
          const abertos = chamados.filter(c => c.status === 'pendente').length;
          const resolvidos = chamados.filter(c => c.status === 'concluído').length;
          const pendentes = chamados.filter(c => c.status === 'em andamento').length;
          
          setStats({ abertos, resolvidos, pendentes });
        }
      } catch (error) {
        console.error('Erro ao carregar chamados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, [user]);

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
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header com perfil */}
          <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Olá, {user?.nome || 'Usuário'}!</h1>
              <p className="text-gray-600">Aqui está o resumo da sua conta e chamados.</p>
              <p className="text-sm text-blue-600 capitalize mt-1">Função: {user?.funcao}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 rounded-full p-2">
                <User className="h-8 w-8 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {acoes.map(({ label, link, icon }) => (
                <Link
                  key={label}
                  href={link}
                  className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center gap-3 border hover:shadow-md transition hover:scale-[1.02]"
                >
                  {icon}
                  <span className="font-semibold text-gray-900">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Estatísticas do usuário */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo Rápido</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <p className="text-4xl font-bold text-blue-600">{stats.abertos}</p>
                <p className="text-gray-600">Chamados Abertos</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <p className="text-4xl font-bold text-green-600">{stats.resolvidos}</p>
                <p className="text-gray-600">Chamados Resolvidos</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <p className="text-4xl font-bold text-yellow-600">{stats.pendentes}</p>
                <p className="text-gray-600">Pendentes de Resposta</p>
              </div>
            </div>
          </div>

          {/* Meus chamados */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Meus Chamados Recentes</h2>
            {meusChamados.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="py-2 px-4">Título</th>
                      <th className="py-2 px-4">Data</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meusChamados.map((chamado, i) => (
                      <tr
                        key={chamado.id}
                        className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <td className="py-2 px-4">{chamado.titulo}</td>
                        <td className="py-2 px-4">
                          {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[chamado.status]}`}
                          >
                            {chamado.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">{chamado.tipo_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum chamado encontrado.</p>
                <Link href="/abrir-chamado" className="text-blue-600 hover:underline mt-2 inline-block">
                  Abrir seu primeiro chamado
                </Link>
              </div>
            )}
          </div>

          {/* Mensagens e alertas */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Avisos Importantes</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <AlertTriangle className="text-yellow-600" />
                <p className="text-gray-700">O sistema passará por manutenção no dia 20/08/2025, das 02h às 05h.</p>
              </div>
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <CheckCircle className="text-blue-600" />
                <p className="text-gray-700">Bem-vindo ao sistema Zelos! Use as ações rápidas para começar.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
