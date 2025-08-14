"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";

const acoes = [
  "Gerenciar chamados",
  "Cadastrar usuário",
  "Relatórios",
  "Configurações",
];

const resumoChamados = [
  { chamado: "Payment from Bonnie Green", date: "Apr 23, 2021", amount: "$2300", status: "Completed" },
  { chamado: "Payment refund to #00910", date: "Apr 23, 2021", amount: "-$670", status: "Completed" },
  { chamado: "Payment failed from #087651", date: "Apr 18, 2021", amount: "$234", status: "Cancelled" },
  { chamado: "Payment from Bonnie Green", date: "Apr 15, 2021", amount: "$5000", status: "In progress" },
  { chamado: "Payment from Jese Leos", date: "Apr 15, 2021", amount: "$2300", status: "In progress" },
  { chamado: "Payment from THEMSBERG LLC", date: "Apr 11, 2021", amount: "$280", status: "Completed" },
];

const statusColors = {
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  "In progress": "bg-blue-100 text-blue-700",
};

export default function DashboardAdmin() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600">Visão geral completa do sistema de chamados</p>
          </div>
          <TrendingUp className="h-12 w-12 text-green-500 hidden md:block" />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FileText, label: "Total de Chamados", value: "156", color: "bg-blue-100 text-blue-600" },
            { icon: Clock, label: "Em Aberto", value: "23", color: "bg-yellow-100 text-yellow-600" },
            { icon: CheckCircle, label: "Resolvidos", value: "133", color: "bg-green-100 text-green-600" },
            { icon: Users, label: "Usuários Ativos", value: "89", color: "bg-purple-100 text-purple-600" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border p-6 flex items-center hover:shadow-lg transition">
              <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chamados e Atividade */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chamados Recentes */}
          <div className="bg-white rounded-2xl shadow-md border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Chamados Recentes</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Ver todos</button>
            </div>
            <div className="space-y-4">
              {[
                { prioridade: "Urgente", cor: "bg-red-100 text-red-800", titulo: "Problema de Login", usuario: "João Silva", tempo: "há 2 horas", ponto: "bg-red-500" },
                { prioridade: "Média", cor: "bg-yellow-100 text-yellow-800", titulo: "Impressora Offline", usuario: "Maria Santos", tempo: "há 4 horas", ponto: "bg-yellow-500" },
                { prioridade: "Baixa", cor: "bg-blue-100 text-blue-800", titulo: "Acesso ao Sistema", usuario: "Pedro Costa", tempo: "há 6 horas", ponto: "bg-blue-500" },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${c.ponto}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.titulo}</p>
                      <p className="text-xs text-gray-500">{c.usuario} • {c.tempo}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${c.cor}`}>{c.prioridade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Atividade do Sistema */}
          <div className="bg-white rounded-2xl shadow-md border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Atividade do Sistema</h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {[
                { label: "Chamados hoje", value: "12" },
                { label: "Resolvidos hoje", value: "8" },
                { label: "Tempo médio resolução", value: "4.2h" },
                { label: "Satisfação", value: "4.8/5" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tendência */}
        <div className="bg-white rounded-2xl shadow-md border p-6">
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

        {/* Ações rápidas e Resumo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ações rápidas */}
          <div className="bg-white rounded-2xl shadow-md border p-6">
            <h2 className="font-semibold text-lg mb-4">Ações rápidas</h2>
            <ul className="list-inside space-y-2 text-black cursor-pointer">
              {acoes.map((acao) => (
                <li className="border-b pb-2 hover:text-blue-600 transition" key={acao}>
                  <Link href={`/${acao.toLowerCase().replace(/\s+/g, "-")}`}>{acao}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resumo dos chamados */}
          <div className="bg-white rounded-2xl shadow-md border p-6">
            <h2 className="font-semibold text-lg mb-4">Resumo dos Chamados</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2">Chamado</th>
                  <th className="py-2">Data</th>
                  <th className="py-2">Valor</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {resumoChamados.map(({ chamado, date, amount, status }, i) => (
                  <tr key={i} className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="py-2">{chamado}</td>
                    <td className="py-2">{date}</td>
                    <td className="py-2 font-mono">{amount}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
