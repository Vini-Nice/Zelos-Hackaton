"use client";

import { Book, Video, FileText } from "lucide-react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

const recursos = [
  {
    id: 1,
    titulo: "Manual do Usuário",
    descricao: "Guia completo para utilizar todas as funcionalidades do sistema.",
    icone: <FileText className="h-6 w-6 text-blue-600" />,
    link: "/recursos/manual",
  },
  {
    id: 2,
    titulo: "Tutoriais em Vídeo",
    descricao: "Vídeos passo a passo mostrando como resolver problemas comuns.",
    icone: <Video className="h-6 w-6 text-green-600" />,
    link: "/recursos/tutoriais-video",
  },
  {
    id: 3,
    titulo: "Dicas de Boas Práticas",
    descricao: "Recomendações para usar o sistema de forma eficiente e segura.",
    icone: <Book className="h-6 w-6 text-purple-600" />,
    link: "/recursos/dicas",
  },
];

export default function Recursos() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Recursos e Tutoriais</h1>
          <UserAvatar name="Usuário" avatar="" size={40} />
        </div>

        {/* Cards de recursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {recursos.map(({ id, titulo, descricao, icone, link }) => (
            <a
              key={id}
              href={link}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition cursor-pointer block"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">{icone}</div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{titulo}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{descricao}</p>
            </a>
          ))}
        </div>

        {/* Dicas rápidas / FAQ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Dicas Rápidas</h2>
          <ul className="space-y-3">
            <li className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-gray-100">Como acessar tutoriais offline?</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Baixe os PDFs disponíveis na seção de recursos.</p>
            </li>
            <li className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-gray-100">Como navegar pelo manual?</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Use o índice lateral para acessar tópicos específicos rapidamente.</p>
            </li>
            <li className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-gray-100">Dicas para resolver problemas comuns</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Verifique primeiro a seção de FAQ antes de abrir um chamado.</p>
            </li>
          </ul>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
