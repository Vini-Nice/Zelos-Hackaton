"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  MessageSquare,
  User,
  LogOut,
  GraduationCap,
  HelpCircle,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Plus,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function ZelosDashboard({ onToggle }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const getRoutesByUserType = () => {
    if (user?.funcao === "admin") {
      return [
        { href: "/home-adm", icon: Home, label: "Home" },
        { href: "/integrantes", icon: Users, label: "Gerenciar Usuários" },
        {
          href: "/chamados-usuarios",
          icon: FileText,
          label: "Gerenciar Chamados",
        },
        { href: "/apontamentos", icon: Wrench, label: "Apontamentos" },
      ];
    } else if (user?.funcao === "tecnico") {
      return [
        { href: "/home-manutencao", icon: Wrench, label: "Home" },
        {
          href: "/vizualizar-chamados",
          icon: FileText,
          label: "Visualizar Chamados",
        },
      ];
    } else if (user?.funcao === "usuario_comum") {
      return [
        { href: "/", icon: Home, label: "Home" },
        { href: "/abrir-chamado", icon: Plus, label: "Abrir Chamado" },
        { href: "/meus-chamados", icon: FileText, label: "Meus Chamados" },
      ];
    }
    return [];
  };

  const commonRoutes = [
    { href: "/perfil", icon: User, label: "Perfil" },
    { href: "/ajuda", icon: HelpCircle, label: "Ajuda" },
    { href: "/suporte", icon: MessageSquare, label: "Suporte" },
  ];

  const allRoutes = [...getRoutesByUserType(), ...commonRoutes];

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Botão colapsar */}
      <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newState = !isCollapsed;
            setIsCollapsed(newState);
            onToggle?.(newState);
          }}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navegação */}
      <nav className="p-2 space-y-2"> {/* Mudei p-4 para p-2 para ficar mais justo */}
        {allRoutes.map(({ href, icon: Icon, label }) => (
          // NOVO: Adicionado 'relative group' ao wrapper do link
          <div key={href} className="relative group flex items-center">
            <Link href={href} passHref legacyBehavior>
              <a
                className={`flex items-center transition-colors duration-200 ${
                  isCollapsed
                    ? "w-10 h-10 justify-center mx-auto rounded-lg" // Ícones centralizados
                    : "w-full justify-start px-4 py-2 rounded-md" // Expandido ocupa toda largura
                } ${
                  isActive(href)
                    ? "text-white bg-blue-600 dark:bg-blue-500"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-4 w-4" /> {/* Aumentei um pouco o ícone */}
                {!isCollapsed && <span className="ml-3">{label}</span>}
              </a>
            </Link>

            {/* NOVO: Tooltip que aparece no hover quando colapsado */}
            {isCollapsed && (
              <div
                className="absolute left-full ml-4 px-3 py-1.5 text-sm font-medium
                           bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
                           rounded-md shadow-md
                           opacity-0 invisible group-hover:opacity-100 group-hover:visible
                           transition-opacity duration-300 whitespace-nowrap
                           pointer-events-none" // Impede que o mouse interaja com o tooltip
              >
                {label}
              </div>
            )}
          </div>
        ))}

        {/* Logout */}
        <div className="relative group flex items-center">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`w-full flex items-center transition-colors duration-200
              ${
                isCollapsed
                  ? "w-10 h-10 justify-center mx-auto"
                  : "justify-start px-4 py-2"
              }
              text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800`}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Sair</span>}
          </Button>

          {/* NOVO: Tooltip para o botão de Logout */}
          {isCollapsed && (
            <div
              className="absolute left-full ml-4 px-3 py-1.5 text-sm font-medium
                         bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
                         rounded-md shadow-md
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible
                         transition-opacity duration-300 whitespace-nowrap
                         pointer-events-none"
            >
              Sair
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}