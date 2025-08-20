import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import ZelosDashboard from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import SuporteFlutuante from "@/components/SuporteFlutuante/SuporteFlutuante";

export const metadata = {
  title: "Zelos - Sistema de Chamados",
  description: "Sistema de gerenciamento de chamados e suporte técnico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
