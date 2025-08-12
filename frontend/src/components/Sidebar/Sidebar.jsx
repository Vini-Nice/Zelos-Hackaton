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
  

  return (
    <div className=" bg-gray-50">
      

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50">
              <Home className="mr-3 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700">
              <Plus className="mr-3 h-4 w-4" />
              Abrir chamado
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700">
              <MessageSquare className="mr-3 h-4 w-4" />
              Meus Chamados
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700">
              <User className="mr-3 h-4 w-4" />
              Perfil/Conta
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700">
              <LogOut className="mr-3 h-4 w-4" />
              Sair
            </Button>
            <div className="pt-4 border-t border-gray-200">
              <Button variant="ghost" className="w-full justify-start text-gray-700">
                <BookOpen className="mr-3 h-4 w-4" />
                Manual e FAQ inclusivos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-700">
                <GraduationCap className="mr-3 h-4 w-4" />
                Recursos e tutoriais
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-700">
                <HelpCircle className="mr-3 h-4 w-4" />
                Ajuda
              </Button>
            </div>
          </nav>
        </aside>

       
       
      </div>

     
    </div>
  )
}
