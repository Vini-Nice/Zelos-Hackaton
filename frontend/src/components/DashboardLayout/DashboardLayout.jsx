"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import ZelosDashboard from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import SuporteFlutuante from "@/components/SuporteFlutuante/SuporteFlutuante";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Função para atualizar o estado do sidebar
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <ProtectedRoute>
      <Header/>
      <div className="flex">
        <ZelosDashboard onToggle={handleSidebarToggle} />
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        } lg:ml-64`}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </div>
          <SuporteFlutuante/>
        </main>
      </div>
    </ProtectedRoute>
  );
}
