"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle"; // import do toggle

export default function Header() {
  const [open, setOpen] = useState(false);

  const notificacoes = [
    { id: 1, mensagem: "Seu chamado 'Erro na impressora' foi resolvido", lida: false },
    { id: 2, mensagem: "Nova atualização disponível no sistema", lida: false },
    { id: 3, mensagem: "Manutenção programada dia 20/08 às 02h", lida: true },
  ];

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  const usuario = {
    name: "Felipe",
    avatar: "",
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-12 px-10 flex items-center justify-between relative">
      <h1 className="text-xl text-gray-900 dark:text-gray-100 font-bold">ZELOS</h1>

      <div className="flex items-center gap-4">
        {/* Toggle de modo noturno */}
        <DarkModeToggle />

        {/* Sino de notificações */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative focus:outline-none"
          >
            <Bell className="h-6 w-6 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white" />
            {naoLidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {naoLidas}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Notificações</h2>
                <ul className="max-h-60 overflow-y-auto">
                  {notificacoes.map((n) => (
                    <li
                      key={n.id}
                      className={`p-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        !n.lida ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {n.mensagem}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Avatar do usuário */}
        <UserAvatar name={usuario.name} avatar={usuario.avatar} size={32} />
      </div>
    </header>
  );
}
