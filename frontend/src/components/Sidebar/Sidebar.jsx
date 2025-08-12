import Link from "next/link"
import { Button } from "@/components/ui/button"
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

export default function Sidebar() {
  return (
    <div className="bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Link href="/" passHref legacyBehavior>
              <Button asChild variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50">
                <a>
                  <Home className="mr-3 h-4 w-4" />
                  Home
                </a>
              </Button>
            </Link>

            <Link href="/abrir-chamado" passHref legacyBehavior>
              <Button asChild variant="ghost" className="w-full justify-start text-gray-700">
                <a>
                  <Plus className="mr-3 h-4 w-4" />
                  Abrir chamado
                </a>
              </Button>
            </Link>

            <Link href="/meus-chamados" passHref legacyBehavior>
              <Button asChild variant="ghost" className="w-full justify-start text-gray-700">
                <a>
                  <MessageSquare className="mr-3 h-4 w-4" />
                  Meus Chamados
                </a>
              </Button>
            </Link>

            <Link href="/perfil" passHref legacyBehavior>
              <Button asChild variant="ghost" className="w-full justify-start text-gray-700">
                <a>
                  <User className="mr-3 h-4 w-4" />
                  Perfil/Conta
                </a>
              </Button>
            </Link>

            <Link href="/logout" passHref legacyBehavior>
              <Button asChild variant="ghost" className="w-full justify-start text-gray-700">
                <a>
                  <LogOut className="mr-3 h-4 w-4" />
                  Sair
                </a>
              </Button>
            </Link>

            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link href="/manual-faq" passHref legacyBehavior>
                <Button asChild variant="ghost" className="w-full justify-start text-gray-700">
                  <a>
                    <BookOpen className="mr-3 h-4 w-4" />
                    Manual e FAQ inclusivos
                  </a>
                </Button>
              </Link>

              <Link href="/recursos-tutoriais" passHref legacyBehavior>
                <Button asChild variant="ghost" className="w-full justify-start text-gray-700">
                  <a>
                    <GraduationCap className="mr-3 h-4 w-4" />
                    Recursos e tutoriais
                  </a>
                </Button>
              </Link>

              <Link href="/ajuda" passHref legacyBehavior>
                <Button asChild variant="ghost" className="w-full justify-start text-gray-700">
                  <a>
                    <HelpCircle className="mr-3 h-4 w-4" />
                    Ajuda
                  </a>
                </Button>
              </Link>
            </div>
          </nav>
        </aside>
      </div>
    </div>
  )
}
