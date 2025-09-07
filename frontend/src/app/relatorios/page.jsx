"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { apiRequest } from "@/lib/auth";
import { BookCopy } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function RelatoriosPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data = await apiRequest("/api/relatorios/chamados");
        setReportData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do relatório:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const statusData = reportData ? Object.entries(reportData.porStatus).map(([name, value]) => ({ name, value })) : [];
  const tipoData = reportData ? Object.entries(reportData.porTipo).map(([name, value]) => ({ name, value })) : [];
  const performanceData = reportData ? Object.entries(reportData.performanceTecnicos).map(([name, value]) => ({ name, value })) : [];


  return (
    <DashboardLayout>
       <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <BookCopy className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Relatórios</h1>
            </div>
            <div className="flex items-center space-x-4">

            </div>
          </div>
        </header>
      <div className="p-6 md:p-10 space-y-6">
       

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tipoData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance dos Técnicos (Chamados Concluídos)</CardTitle>
          </CardHeader>
          <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}