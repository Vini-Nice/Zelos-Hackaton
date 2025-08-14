"use client";

import { useState } from "react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import { Clock, CheckCircle, FileText } from "lucide-react";

const meusChamados = [
  {
    id: 1,
    titulo: "Erro na impressora",
    status: "Em aberto",
    data: "14/08/2025",
    prioridade: "Alta",
  },
  {
    id: 2,
    titulo: "Problema de login",
    status: "Resolvido",
    data: "13/08/2025",
    prioridade: "Média",
  },
  {
    id: 3,
    titulo: "Solicitação de novo usuário",
    status: "Em aberto",
    data: "12/08/2025",
    prioridade: "Baixa",
  },
];

const statusColors = {
  "Em aberto": "bg-yellow-100 text-yellow-700",
  Resolvido: "bg-green-100 text-green-700",
};

const prioridadeColors = {
  Alta: "bg-red-100 text-red-700",
  Média: "bg-yellow-100 text-yellow-700",
  Baixa: "bg-blue-100 text-blue-700",
};

export default function MeusChamados() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Meus Chamados</h1>
          <UserAvatar name="Felipe" avatar="" size={40} />
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total de Chamados</p>
              <p className="text-2xl font-bold text-gray-900">{meusChamados.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <Clock className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Em Aberto</p>
              <p className="text-2xl font-bold text-gray-900">
                {meusChamados.filter(c => c.status === "Em aberto").length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Resolvidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {meusChamados.filter(c => c.status === "Resolvido").length}
              </p>
            </div>
          </div>
        </div>

        {/* Tabela de chamados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lista de Chamados</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2">Título</th>
                <th className="py-2">Data</th>
                <th className="py-2">Status</th>
                <th className="py-2">Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {meusChamados.map(chamado => (
                <tr key={chamado.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2">{chamado.titulo}</td>
                  <td className="py-2">{chamado.data}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[chamado.status]}`}>
                      {chamado.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${prioridadeColors[chamado.prioridade]}`}>
                      {chamado.prioridade}
                    </span>
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
