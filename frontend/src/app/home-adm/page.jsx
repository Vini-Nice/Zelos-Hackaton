"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Users,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  LogOut,
  BarChart3,
} from "lucide-react";

const chamadosRecentes = [
  { name: "Ana Souza", email: "ana@example.com", avatar: "/avatars/ana.png", status: "Pendente" },
  { name: "Carlos Lima", email: "carlos@example.com", avatar: "/avatars/carlos.png", status: "Concluído" },
  { name: "Mariana Silva", email: "mariana@example.com", avatar: "/avatars/mariana.png", status: "Atrasado" },
];

const estatisticas = [
  { icon: <ClipboardList className="h-4 w-4" />, text: "Total Chamados", value: 45 },
  { icon: <CheckCircle className="h-4 w-4" />, text: "Concluídos", value: 30 },
  { icon: <Clock className="h-4 w-4" />, text: "Pendentes", value: 12 },
  { icon: <AlertTriangle className="h-4 w-4" />, text: "Atrasados", value: 3 },
];

const acoesAdmin = [
  { icon: <Plus className="h-4 w-4" />, text: "Criar Chamado", href: "/admin/novo-chamado" },
  { icon: <Users className="h-4 w-4" />, text: "Gerenciar Usuários", href: "/admin/usuarios" },
  { icon: <BarChart3 className="h-4 w-4" />, text: "Relatórios", href: "/admin/relatorios" },
  { icon: <LogOut className="h-4 w-4" />, text: "Sair", href: "/logout" },
];

export default function DashboardAdmin() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
        <p className="text-gray-600">Visão geral de todos os chamados</p>
      </header>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {estatisticas.map((item, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow flex items-center space-x-3">
            <div className="text-blue-600">{item.icon}</div>
            <div>
              <p className="text-gray-600">{item.text}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chamados Recentes */}
        <div className="bg-white rounded-lg shadow p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Chamados Recentes</h2>
          <ul className="space-y-4">
            {chamadosRecentes.map((chamado, i) => (
              <li key={i} className="flex items-center space-x-3">
                <Image
                  src={chamado.avatar}
                  alt={chamado.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium">{chamado.name}</p>
                  <p className="text-sm text-gray-500">{chamado.email}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    chamado.status === "Concluído"
                      ? "bg-green-100 text-green-700"
                      : chamado.status === "Pendente"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {chamado.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <ul className="space-y-3">
            {acoesAdmin.map((acao, i) => (
              <li key={i}>
                <Link
                  href={acao.href}
                  className="flex items-center space-x-2 text-blue-600 hover:underline"
                >
                  {acao.icon}
                  <span>{acao.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
