"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const chamadoExemplo = {
  titulo: "Erro no login",
  mensagens: [
    { de: "usuário", texto: "Não consigo acessar o sistema.", hora: "09:30" },
    { de: "suporte", texto: "Olá! Já verificamos seu usuário, pode tentar novamente?", hora: "09:35" },
    { de: "usuário", texto: "Agora funcionou, obrigado!", hora: "09:37" },
  ],
};

export default function Suporte() {
  const [mensagens, setMensagens] = useState(chamadoExemplo.mensagens);
  const [novaMensagem, setNovaMensagem] = useState("");

  const enviarMensagem = () => {
    if (novaMensagem.trim() === "") return;
    setMensagens([...mensagens, { de: "usuário", texto: novaMensagem, hora: "Agora" }]);
    setNovaMensagem("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto flex flex-col h-[80vh] bg-white rounded-2xl shadow-md border">
        
        {/* Cabeçalho do chamado */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">{chamadoExemplo.titulo}</h1>
          <span className="text-gray-500 text-sm">Status: Em andamento</span>
        </div>

        {/* Área do chat */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
          {mensagens.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.de === "usuário" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl ${
                  m.de === "usuário" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{m.texto}</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">{m.hora}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input de nova mensagem */}
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <input
            type="text"
            placeholder="Escreva sua mensagem..."
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          />
          <button
            onClick={enviarMensagem}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
