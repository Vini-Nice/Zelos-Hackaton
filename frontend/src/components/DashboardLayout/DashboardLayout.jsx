"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import ZelosDashboard from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import SuporteFlutuante from "@/components/SuporteFlutuante/SuporteFlutuante";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <Header/>
      <div className="flex">
        <ZelosDashboard />
        <main className="flex-1 ml-64">
          {children}
          <SuporteFlutuante/>
        </main>
      </div>
    </ProtectedRoute>
  );
}
