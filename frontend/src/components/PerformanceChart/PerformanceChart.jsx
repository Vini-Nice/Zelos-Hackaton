"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Componente para formatar o tooltip que aparece ao passar o mouse
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const horas = Math.floor(data.tempoTotalMinutos / 60);
    const minutos = data.tempoTotalMinutos % 60;
    const tempoFormatado = horas > 0 ? `${horas}h ${minutos}min` : `${minutos}min`;

    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm">
        <p className="font-bold">{label}</p>
        <p className="text-sm text-blue-600">{`Tempo: ${tempoFormatado}`}</p>
      </div>
    );
  }
  return null;
};


export default function PerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">Dados insuficientes para gerar o gráfico.</p>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} unit="m" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 240, 255, 0.5)' }}/>
          <Bar dataKey="tempoTotalMinutos" name="Tempo em Minutos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}