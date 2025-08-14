"use client";

import { useState } from "react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import { Book, MessageSquare, FileText, Clock } from "lucide-react";

const topicos = [
  {
    id: 1,
    titulo: "Como abrir um chamado",
    descricao: "Passo a passo para criar um novo chamado no sistema.",
    icone: <FileText className="h-6 w-6 text-blue-600" />,
  },
  {
    id: 2,
    titulo: "Acompanhar chamados",
    descricao: "Saiba como acompanhar o status dos seus chamados.",
    icone: <Clock className="h-6 w-6 text-yellow-600" />,
  },
  {
    id: 3,
    titulo: "Manual / FAQ inclusivo",
    descricao: "Documentação detalhada e perguntas frequentes do sistema.",
    icone: <Book className="h-6 w-6 text-green-600" />,
  },
  {
    id: 4,
    titulo: "Contato com suporte",
    descricao: "Formas de entrar em contato direto com a equipe de suporte.",
    icone: <MessageSquare className="h-6 w-6 text-purple-600" />,
  },
];

export default function Ajuda() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Ajuda</h1>
          <UserAvatar name="Felipe" avatar="" size={40} />
        </div>

        {/* Cards de tópicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {topicos.map(({ id, titulo, descricao, icone }) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">{icone}</div>
                <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
              </div>
              <p className="text-gray-600 text-sm">{descricao}</p>
            </div>
          ))}
        </div>

        {/* Perguntas frequentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <ul className="space-y-3">
            <li className="p-3 border-b border-gray-200">
              <p className="font-medium text-gray-900">Como redefinir minha senha?</p>
              <p className="text-sm text-gray-600">Acesse seu perfil e clique em "Redefinir senha".</p>
            </li>
            <li className="p-3 border-b border-gray-200">
              <p className="font-medium text-gray-900">Como abrir um chamado urgente?</p>
              <p className="text-sm text-gray-600">Selecione prioridade alta ao criar o chamado.</p>
            </li>
            <li className="p-3 border-b border-gray-200">
              <p className="font-medium text-gray-900">Posso alterar meus dados pessoais?</p>
              <p className="text-sm text-gray-600">Sim, vá até a seção "Meu Perfil" para editar suas informações.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
