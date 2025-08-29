"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  Plus,
  MessageSquare,
  User,
  LogOut,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Users,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Wrench,
  Bell
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function ZelosDashboard({ onToggle }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => pathname === path;

  // Redirecionamento de logout
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Rotas específicas para cada tipo de usuário
  const getRoutesByUserType = () => {
    if (user?.funcao === "admin") {
      return [
        { href: "/home-adm", icon: Home, label: "Dashboard Admin" },
        { href: "/integrantes", icon: Users, label: "Gerenciar Usuários" },
        { href: "/chamados-usuarios", icon: FileText, label: "Todos os Chamados" },
        { href: "/apontamentos", icon: Wrench, label: "Apontamentos" },
      ];
    } else if (user?.funcao === "tecnico") {
      return [
        { href: "/home-manutencao", icon: Wrench, label: "Dashboard Técnico" },
        { href: "/vizualizar-chamados", icon: FileText, label: "Visualizar Chamados" },
      ];
    } else if (user?.funcao === "usuario_comum") {
      return [
        { href: "/", icon: Home, label: "Página Principal" },
        { href: "/abrir-chamado", icon: FileText, label: "Abrir Chamado" },
        { href: "/meus-chamados", icon: FileText, label: "Meus Chamados" },
      ];
    }
    return [];
  };

  // Rotas comuns para todos os usuários
  const commonRoutes = [
    { href: "/perfil", icon: User, label: "Perfil" },
    { href: "/ajuda", icon: HelpCircle, label: "Ajuda" },
    { href: "/suporte", icon: MessageSquare, label: "Suporte" },
    { href: "/tutoriais", icon: GraduationCap, label: "Tutoriais" },
  ];

  const allRoutes = [...getRoutesByUserType(), ...commonRoutes];

  return (
    <aside className={`bg-white border-r border-gray-200 min-h-screen  transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
      }`}>
      {/* Botão para colapsar/expandir */}
      <div className="flex justify-end p-2 border-b border-gray-200">
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
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {/* Links específicos por função */}
        {allRoutes.map(({ href, icon: Icon, label }) => (
          <Link href={href} key={href} passHref>
            <Button
              variant={isActive(href) ? "default" : "ghost"}
              className={`w-full justify-start ${isActive(href)
                  ? "text-white bg-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
                } ${isCollapsed ? 'px-2' : 'px-4'}`}
              title={isCollapsed ? label : undefined}
            >
              <Icon className={`h-4 w-4 ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
              {!isCollapsed && label}
            </Button>
          </Link>
        ))}

        {/* Botão de logout */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={`w-full justify-start text-gray-700 hover:bg-gray-100 ${isCollapsed ? 'px-2' : 'px-4'
            }`}
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
          {!isCollapsed && "Sair"}
        </Button>
      </nav>
    </aside>
  );
}
