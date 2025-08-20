"use client";

import { useState } from "react";
import { Bell, LogOut, User } from "lucide-react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const notificacoes = [
    { id: 1, mensagem: "Seu chamado 'Erro na impressora' foi resolvido", lida: false },
    { id: 2, mensagem: "Nova atualização disponível no sistema", lida: false },
    { id: 3, mensagem: "Manutenção programada dia 20/08 às 02h", lida: true },
  ];

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
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

        {/* Avatar do usuário com menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <UserAvatar name={user?.nome || "Usuário"} avatar="" size={32} />
            <span className="text-sm text-gray-700 dark:text-gray-200 hidden md:block">
              {user?.nome || "Usuário"}
            </span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-semibold">{user?.nome}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-blue-600 capitalize">{user?.funcao}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push('/perfil');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
