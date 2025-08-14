
"use client";
=======
import Image from "next/image";
import Link from "next/link";

const chamados = [
  { name: "Neil Sims", email: "email@example.com", avatar: "/avatars/neil.png" },
  { name: "Bonnie Green", email: "email@example.com", avatar: "/avatars/bonnie.png" },
  { name: "Micheal Gough", email: "email@example.com", avatar: "/avatars/micheal.png" },
  { name: "Thomas Lean", email: "email@example.com", avatar: "/avatars/thomas.png" },
  { name: "Lana Byrd", email: "email@example.com", avatar: "/avatars/lana.png" },
  { name: "Karen Nelson", email: "email@example.com", avatar: "/avatars/karen.png" },
];

const acoes = [
  "Abrir chamado",
  "Acompanhar chamados",
  "Acessar o manual/FAQ inclusivo",
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
>>>>>>> 5e03741a8c3c4986ee29bcd8fe8d06aadbcc77d9

import { 
  FileText, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Users,
  Activity
} from "lucide-react";

export default function Dashboard() {
  return (

    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema de chamados</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Aberto</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                <p className="text-2xl font-bold text-gray-900">133</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Card de Chamados Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Chamados Recentes</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todos
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Problema de Login</p>
                    <p className="text-xs text-gray-500">João Silva • há 2 horas</p>
                  </div>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Urgente</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Impressora Offline</p>
                    <p className="text-xs text-gray-500">Maria Santos • há 4 horas</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Média</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Acesso ao Sistema</p>
                    <p className="text-xs text-gray-500">Pedro Costa • há 6 horas</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Baixa</span>
              </div>
            </div>
          </div>

          {/* Card de Atividade */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Atividade do Sistema</h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Chamados hoje</span>
                <span className="text-sm font-medium text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolvidos hoje</span>
                <span className="text-sm font-medium text-gray-900">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tempo médio resolução</span>
                <span className="text-sm font-medium text-gray-900">4.2h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Satisfação</span>
                <span className="text-sm font-medium text-gray-900">4.8/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Gráfico */}
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
=======
    <div className=" p-6 bg-gray-50 space-y-6">

      {/* Linha com dois cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 - Últimos chamados */}
        <div className="bg-white rounded-xl shadow p-4 ">
          <h2 className="font-semibold text-lg mb-3">Últimos chamados</h2>
          <ul>
            {chamados.map(({ name, email, avatar }) => (
              <li key={name} className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 relative rounded-full overflow-hidden">
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2 - Ações rápidas */}
        <div className="bg-white rounded-xl shadow p-4 min-h-[280px]">
          <h2 className="font-semibold text-lg  mb-3">Ações rápidas</h2>
          <ul className=" list-inside  space-y-2 text-black cursor-pointer">
            {acoes.map((acao) => (
              <li className="border-b" key={acao}>
                <Link
                  href={`/${acao.toLowerCase().replace(/\s+/g, "-")}`}
                  className=""
                >
                  {acao}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card 3 - Resumo dos chamados */}
      <div className="bg-white rounded-xl shadow p-6 min-h-[280px]">
        <h2 className="font-semibold text-lg mb-4">Resumo dos seus chamados</h2>
        <p className="text-gray-500 mb-6 text-sm">
          This is a list of latest transactions.
        </p>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2">Chamados</th>
              <th className="py-2">Date & Time</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {resumoChamados.map(({ chamado, date, amount, status }, i) => (
              <tr
                key={i}
                className={`border-b border-gray-200 ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-2">{chamado}</td>
                <td className="py-2">{date}</td>
                <td className="py-2 font-mono">{amount}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

>>>>>>> 5e03741a8c3c4986ee29bcd8fe8d06aadbcc77d9
    </div>
  );
}
