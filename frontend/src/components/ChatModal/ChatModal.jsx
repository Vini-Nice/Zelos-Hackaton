"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";

export default function ChatModal({ isOpen, onClose, chamadoId, senderId, receiverId, receiverName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (chamadoId) {
        try {
          const data = await apiRequest(`/api/chat/${chamadoId}`);
          setMessages(data);
        } catch (error) {
          console.error("Erro ao carregar mensagens:", error);
        }
      }
    };

    if (isOpen) {
      fetchMessages();
      // Polling para novas mensagens a cada 5 segundos
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, chamadoId]);
  
  useEffect(scrollToBottom, [messages]);


  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await apiRequest('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          chamado_id: chamadoId,
          sender_id: senderId,
          receiver_id: receiverId,
          message: newMessage,
        }),
      });
      setNewMessage("");
      // Recarrega as mensagens imediatamente após enviar
      const data = await apiRequest(`/api/chat/${chamadoId}`);
      setMessages(data);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col h-[70vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Chat com {receiverName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender_id === senderId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender_id === senderId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs text-muted-foreground/80 mt-1 block text-right">{new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t flex gap-2">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            rows={1}
            className="flex-1 resize-none"
          />
          <Button onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}