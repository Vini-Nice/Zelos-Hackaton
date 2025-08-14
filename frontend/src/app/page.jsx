"use client";
<<<<<<< HEAD

=======
import Image from "next/image";
>>>>>>> 22be4df3319f41c1bfc4a510672b1a24de95fb1e
import Link from "next/link";
import { FileText, Clock, CheckCircle, HelpCircle, AlertTriangle, User } from "lucide-react";

const acoes = [
  { label: "Abrir Chamado", link: "/abrir-chamado", icon: <FileText className="h-10 w-10 text-blue-600" /> },
  { label: "Acompanhar Chamados", link: "/acompanhar-chamados", icon: <Clock className="h-10 w-10 text-purple-600" /> },
  { label: "Manual / FAQ", link: "/faq", icon: <HelpCircle className="h-10 w-10 text-green-600" /> },
];

const meusChamados = [
  { titulo: "Problema no login", data: "14/08/2025", status: "Em Aberto", prioridade: "Alta" },
  { titulo: "Erro na impressora", data: "13/08/2025", status: "Resolvido", prioridade: "Média" },
  { titulo: "Falha no sistema interno", data: "12/08/2025", status: "Em andamento", prioridade: "Alta" },
];

const statusColors = {
  "Em Aberto": "bg-yellow-100 text-yellow-800",
  "Resolvido": "bg-green-100 text-green-800",
  "Em andamento": "bg-blue-100 text-blue-800",
};

export default function DashboardUsuario() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header com perfil */}
        <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Olá, Felipe!</h1>
            <p className="text-gray-600">Aqui está o resumo da sua conta e chamados.</p>
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
              <p className="text-4xl font-bold text-blue-600">3</p>
              <p className="text-gray-600">Chamados Abertos</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <p className="text-4xl font-bold text-green-600">5</p>
              <p className="text-gray-600">Chamados Resolvidos</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <p className="text-4xl font-bold text-yellow-600">1</p>
              <p className="text-gray-600">Pendentes de Resposta</p>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Meus chamados */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meus Chamados Recentes</h2>
          <div className="overflow-x-auto">
=======
        {/* Gráfico */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Tendência de Chamados</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-500">Gráfico de tendência</p>
              <p className="text-sm text-gray-400">Integração com biblioteca de gráficos</p>
            </div>
          </div>
        </div>
      </div>
    <div className=" p-6 bg-gray-50 space-y-6">

        {/* Últimos Chamados & Ações rápidas */}
        <div className="p-6 bg-gray-50 space-y-6 w-full">
          

            {/* Ações rápidas */}
            <div className="bg-white rounded-xl shadow p-4 min-h-[280px]">
              <h2 className="font-semibold text-lg mb-3">Ações rápidas</h2>
              <ul className="list-inside space-y-2 text-black cursor-pointer">
                {acoes.map((acao) => (
                  <li className="border-b" key={acao}>
                    <Link
                      href={`/${acao.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {acao}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          

          {/* Resumo dos chamados */}
          <div className="bg-white rounded-xl shadow p-6 min-h-[280px]">
            <h2 className="font-semibold text-lg mb-4">Resumo dos seus chamados</h2>
            <p className="text-gray-500 mb-6 text-sm">
              This is a list of latest transactions.
            </p>
>>>>>>> 22be4df3319f41c1bfc4a510672b1a24de95fb1e
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 px-4">Título</th>
                  <th className="py-2 px-4">Data</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Prioridade</th>
                </tr>
              </thead>
              <tbody>
                {meusChamados.map((chamado, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="py-2 px-4">{chamado.titulo}</td>
                    <td className="py-2 px-4">{chamado.data}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[chamado.status]}`}
                      >
                        {chamado.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{chamado.prioridade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <p className="text-gray-700">Seu chamado "Erro na impressora" foi resolvido. Obrigado pela paciência!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
