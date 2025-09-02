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
  Wrench, Plus
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
      <nav className="p-4 space-y-2">
        {allRoutes.map(({ href, icon: Icon, label }) => (
          <Link href={href} key={href} passHref>
            <Button
              variant={isActive(href) ? "default" : "ghost"}
              className={`${
                isCollapsed
                  ? "w-10 h-10 justify-center mx-auto rounded-lg" // Ícones centralizados
                  : "w-full justify-start px-4" // Expandido ocupa toda largura
              } ${
                isActive(href)
                  ? "text-white bg-blue-600 dark:bg-blue-500"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
              title={isCollapsed ? label : undefined}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">{label}</span>}
            </Button>
          </Link>
        ))}

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={`w-full justify-start text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 ${
            isCollapsed ? "px-2" : "px-4"
          }`}
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? "mr-0" : "mr-3"}`} />
          {!isCollapsed && "Sair"}
        </Button>
      </nav>
    </aside>
  );
}
