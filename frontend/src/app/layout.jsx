import "./globals.css";
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
        <Header/>
        <div className="flex">
          <ZelosDashboard />
          <main className="flex-1 ml-64">
            {children}
            <SuporteFlutuante/>
          </main>
        </div>
      </body>
    </html>
  );
}
