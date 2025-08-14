"use client";

import { useState } from "react";
import { CheckCircle, Clock, Users, FileText } from "lucide-react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";

const chamadosPendentes = [
  {
    id: 1,
    titulo: "Impressora offline",
    solicitante: "Maria Santos",
    prioridade: "Média",
    status: "Em aberto",
    data: "14/08/2025",
  },
  {
    id: 2,
    titulo: "Erro no login do sistema",
    solicitante: "João Silva",
    prioridade: "Alta",
    status: "Em andamento",
    data: "13/08/2025",
  },
  {
    id: 3,
    titulo: "Acesso negado ao banco de dados",
    solicitante: "Pedro Costa",
    prioridade: "Alta",
    status: "Em aberto",
    data: "12/08/2025",
  },
];

const statusColors = {
  "Em aberto": "bg-yellow-100 text-yellow-700",
  "Em andamento": "bg-blue-100 text-blue-700",
  Resolvido: "bg-green-100 text-green-700",
  Cancelado: "bg-red-100 text-red-700",
};

export default function HomeManutencao() {
  const [chamados, setChamados] = useState(chamadosPendentes);

  const alterarStatus = (id, novoStatus) => {
    setChamados((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: novoStatus } : c))
    );
  };

  const resumo = {
    total: chamados.length,
    emAberto: chamados.filter((c) => c.status === "Em aberto").length,
    emAndamento: chamados.filter((c) => c.status === "Em andamento").length,
    resolvidos: chamados.filter((c) => c.status === "Resolvido").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel de Manutenção</h1>
          <UserAvatar name="Felipe" avatar="" size={40} />
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Em Aberto</p>
              <p className="text-2xl font-bold text-gray-900">{resumo.emAberto}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-gray-900">{resumo.emAndamento}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Resolvidos</p>
              <p className="text-2xl font-bold text-gray-900">{resumo.resolvidos}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total de Chamados</p>
              <p className="text-2xl font-bold text-gray-900">{resumo.total}</p>
            </div>
          </div>
        </div>

        {/* Lista de chamados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chamados Atribuídos</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2">Chamado</th>
                <th className="py-2">Solicitante</th>
                <th className="py-2">Prioridade</th>
                <th className="py-2">Data</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((c) => (
                <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2">{c.titulo}</td>
                  <td className="py-2">{c.solicitante}</td>
                  <td className="py-2">{c.prioridade}</td>
                  <td className="py-2">{c.data}</td>
                  <td className="py-2">
                    <select
                      value={c.status}
                      onChange={(e) => alterarStatus(c.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-sm ${statusColors[c.status]}`}
                    >
                      <option value="Em aberto">Em aberto</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Resolvido">Resolvido</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
