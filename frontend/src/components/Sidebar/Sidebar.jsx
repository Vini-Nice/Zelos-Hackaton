"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Plus,
  MessageSquare,
  User,
  LogOut,
  BookOpen,
  GraduationCap,
  HelpCircle,
} from "lucide-react"

export default function ZelosDashboard() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen mt-14 fixed left-0 top-0">
      <nav className="p-4 space-y-2">
        <Link href="/" passHref>
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            className={`w-full justify-start ${isActive("/")
                ? "text-white bg-blue-600"
                : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <Home className="mr-3 h-4 w-4" />
            Home
          </Button>
        </Link>

        <Link href="/abrir-chamado" passHref>
          <Button
            variant={isActive("/abrir-chamado") ? "default" : "ghost"}
            className={`w-full justify-start ${isActive("/abrir-chamado")
                ? "text-white bg-blue-600"
                : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <Plus className="mr-3 h-4 w-4" />
            Abrir chamado
          </Button>
        </Link>

        <Link href="/meus-chamados" passHref>
          <Button
            variant={isActive("/meus-chamados") ? "default" : "ghost"}
            className={`w-full justify-start ${isActive("/meus-chamados")
                ? "text-white bg-blue-600"
                : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <MessageSquare className="mr-3 h-4 w-4" />
            Meus Chamados
          </Button>
        </Link>

        <Link href="/perfil" passHref>
          <Button
            variant={isActive("/perfil") ? "default" : "ghost"}
            className={`w-full justify-start ${isActive("/perfil")
                ? "text-white bg-blue-600"
                : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <User className="mr-3 h-4 w-4" />
            Perfil/Conta
          </Button>
        </Link>

        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Button>

        <div className="pt-4 border-t border-gray-200">
          <Link href="/manual" passHref>
            <Button
              variant={isActive("/manual") ? "default" : "ghost"}
              className={`w-full justify-start ${isActive("/manual")
                  ? "text-white bg-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <BookOpen className="mr-3 h-4 w-4" />
              Manual e FAQ inclusivos
            </Button>
          </Link>

          <Link href="/tutoriais" passHref>
            <Button
              variant={isActive("/tutoriais") ? "default" : "ghost"}
              className={`w-full justify-start ${isActive("/tutoriais")
                  ? "text-white bg-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <GraduationCap className="mr-3 h-4 w-4" />
              Recursos e tutoriais
            </Button>
          </Link>

          <Link href="/ajuda" passHref>
            <Button
              variant={isActive("/ajuda") ? "default" : "ghost"}
              className={`w-full justify-start ${isActive("/ajuda")
                  ? "text-white bg-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <HelpCircle className="mr-3 h-4 w-4" />
              Ajuda
            </Button>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
