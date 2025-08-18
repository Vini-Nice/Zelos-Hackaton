import "./globals.css";
import ZelosDashboard from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import SuporteFlutuante from "@/components/SuporteFlutuante/SuporteFlutuante";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Zelos - Sistema de Chamados",
  description: "Sistema de gerenciamento de chamados e suporte técnico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Header/>
          <div className="flex">
            <ZelosDashboard />
            <main className="flex-1 ml-64">
              {children}
              <SuporteFlutuante/>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
