"use client";

import { Book, Video, FileText } from "lucide-react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Recursos e Tutoriais</h1>
          <UserAvatar name="Felipe" avatar="" size={40} />
        </div>

        {/* Cards de recursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {recursos.map(({ id, titulo, descricao, icone, link }) => (
            <a
              key={id}
              href={link}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer block"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">{icone}</div>
                <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
              </div>
              <p className="text-gray-600 text-sm">{descricao}</p>
            </a>
          ))}
        </div>

        {/* Dicas rápidas / FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dicas Rápidas</h2>
          <ul className="space-y-3">
            <li className="p-3 border-b border-gray-200">
              <p className="font-medium text-gray-900">Como acessar tutoriais offline?</p>
              <p className="text-sm text-gray-600">Baixe os PDFs disponíveis na seção de recursos.</p>
            </li>
            <li className="p-3 border-b border-gray-200">
              <p className="font-medium text-gray-900">Como navegar pelo manual?</p>
              <p className="text-sm text-gray-600">Use o índice lateral para acessar tópicos específicos rapidamente.</p>
            </li>
            <li className="p-3 border-b border-gray-200">
              <p className="font-medium text-gray-900">Dicas para resolver problemas comuns</p>
              <p className="text-sm text-gray-600">Verifique primeiro a seção de FAQ antes de abrir um chamado.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
