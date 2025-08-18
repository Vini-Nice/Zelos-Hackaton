"use client";

import { useState } from "react";
import { Bell, LogOut, User, Settings } from "lucide-react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle";
import { useAuth } from "../../contexts/AuthContext";
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

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
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

        {/* Menu do usuário */}
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <UserAvatar 
              name={user?.displayName || user?.username || 'Usuário'} 
              avatar="" 
              size={32} 
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 hidden md:block">
              {user?.displayName || user?.username || 'Usuário'}
            </span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.displayName || user?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || 'Usuário'}
                  </p>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      // Adicionar rota para perfil quando implementar
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </button>
                  
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      // Adicionar rota para configurações quando implementar
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </button>
                  
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
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
