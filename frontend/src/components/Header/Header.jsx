"use client";

import { useState } from "react";
import { Bell, LogOut, User, Menu, X } from "lucide-react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-14 px-4 md:px-6 lg:px-10 flex items-center justify-between relative z-50">
      {/* Logo e Menu Mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      <img src="/logo_e.png" alt="" className="w-40" />

      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <UserAvatar name={user?.nome || "Usuário"} avatar="" size={40} />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{user?.nome}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user?.funcao}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/perfil');
              }}
              className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-3"
            >
              <User className="h-4 w-4" />
              Perfil
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-3 text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Área direita - Desktop */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Toggle de modo noturno */}
        <DarkModeToggle />

        {/* Sino de notificações */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          >
            <Bell className="h-5 w-5 md:h-6 md:w-6 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white" />
            {naoLidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                {naoLidas}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Notificações</h2>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notificacoes.length > 0 ? (
                    notificacoes.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          !n.lida ? "font-semibold text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <p className="mb-1">{n.mensagem}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {!n.lida && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>}
                          {new Date().toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nenhuma notificação</p>
                  )}
                </div>
                {notificacoes.length > 0 && (
                  <button className="w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Ver todas
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar do usuário com menu - Desktop */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          >
            <UserAvatar name={user?.nome || "Usuário"} avatar="" size={32} />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.nome || "Usuário"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.funcao}
              </p>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-3">
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 mb-2">
                  <p className="font-semibold">{user?.nome}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{user?.email}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">{user?.funcao}</p>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push('/perfil');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Avatar do usuário - Mobile */}
        <div className="lg:hidden">
          <UserAvatar name={user?.nome || "Usuário"} avatar="" size={32} />
        </div>
      </div>
    </header>
  );
}
