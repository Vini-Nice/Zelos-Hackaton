"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, UserPlus, MessageSquare, ArrowLeft, Bot, HelpCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- DADOS PARA RESPOSTAS AUTOMÁTICAS ---
const faqData = [
    { question: "Como abro um chamado?", answer: "Para abrir um chamado, vá para o menu lateral, clique em 'Abrir Chamado', preencha os campos e clique em 'Enviar'." },
    { question: "Onde acompanho meus chamados?", answer: "Você pode ver o status de todos os seus chamados na página 'Meus Chamados', com atualização em tempo real." },
    { question: "Como redefinir minha senha?", answer: "Acesse a página 'Perfil' no menu para alterar suas credenciais de acesso." },
    { question: "Qual o prazo para meu chamado ser atendido?", answer: "O tempo de resposta varia com a prioridade. Você será notificado quando o status mudar para 'Em Andamento'." }
];

// --- COMPONENTE PRINCIPAL ---
export default function SuportePage() {
    const { user } = useAuth();

    if (!user) return <DashboardLayout><div className="flex h-screen items-center justify-center text-gray-500">Carregando...</div></DashboardLayout>;

    return user.funcao === 'admin' ? <AdminChatInterface currentUser={user} /> : <UserChatInterface currentUser={user} />;
}

// --- INTERFACE ADMIN ---
const AdminChatInterface = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [view, setView] = useState('chats'); // Estado para controlar a visão: 'chats' ou 'new'

    const fetchAllData = async () => {
        try {
            const [usersData, conversationsData] = await Promise.all([
                apiRequest('/api/support/users'),
                apiRequest(`/api/support/conversations/${currentUser.id}`)
            ]);
            setUsers(usersData.filter(u => u.id !== currentUser.id));
            setConversations(conversationsData);
        } catch (error) { console.error("Erro ao buscar dados do chat:", error); }
    };

    useEffect(() => { fetchAllData(); }, [currentUser.id]);

    useEffect(() => {
        if (!currentChat?.conversationId) return;
        const fetchMessages = async () => {
            const data = await apiRequest(`/api/support/messages/${currentChat.conversationId}`);
            setMessages(data);
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [currentChat]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentChat) return;
        await apiRequest('/api/support/messages', {
            method: 'POST',
            body: JSON.stringify({ sender_id: currentUser.id, receiver_id: currentChat.receiver.id, message: newMessage }),
        });
        setNewMessage("");
        const data = await apiRequest(`/api/support/messages/${currentChat.conversationId}`);
        setMessages(data);
    };

    const startNewChat = async (receiver) => {
        const existingConvo = conversations.find(c => c.user1_id === receiver.id || c.user2_id === receiver.id);
        if (existingConvo) {
            selectConversation(existingConvo);
            setView('chats');
            return;
        }

        try {
            await apiRequest('/api/support/messages', {
                method: 'POST',
                body: JSON.stringify({ sender_id: currentUser.id, receiver_id: receiver.id, message: `Olá, ${receiver.nome}! Sou do suporte.` }),
            });
            const conversationsData = await apiRequest(`/api/support/conversations/${currentUser.id}`);
            setConversations(conversationsData);
            const newConvo = conversationsData.find(c => c.user1_id === receiver.id || c.user2_id === receiver.id);
            if(newConvo) selectConversation(newConvo);
            setView('chats');
        } catch (error) { console.error("Erro ao iniciar nova conversa:", error); }
    };

    const selectConversation = (convo) => {
        const receiverId = convo.user1_id === currentUser.id ? convo.user2_id : convo.user1_id;
        const receiver = users.find(u => u.id === receiverId) || { id: receiverId, nome: `Usuário ${receiverId}` };
        setCurrentChat({ conversationId: convo.id, receiver });
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-4rem)] p-4 flex gap-4">
                {/* Painel Esquerdo */}
                <div className="w-1/3 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
                        <h2 className="font-semibold text-lg">{view === 'chats' ? "Conversas" : "Iniciar Conversa"}</h2>
                        <Button variant="ghost" size="icon" onClick={() => setView(view === 'chats' ? 'new' : 'chats')}>
                            {view === 'chats' ? <UserPlus className="h-5 w-5"/> : <ArrowLeft className="h-5 w-5"/>}
                        </Button>
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto">
                        {view === 'chats' ? (
                            conversations.map(convo => {
                                const receiverId = convo.user1_id === currentUser.id ? convo.user2_id : convo.user1_id;
                                const receiver = users.find(u => u.id === receiverId);
                                return (
                                    <div key={convo.id} onClick={() => selectConversation(convo)} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-lg">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{receiver?.nome.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-medium">{receiver?.nome || `Usuário ${receiverId}`}</p>
                                    </div>
                                )
                            })
                        ) : (
                             users.map(user => (
                                <div key={user.id} onClick={() => startNewChat(user)} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-lg">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                       <p className="font-medium">{user.nome}</p>
                                       <p className="text-sm text-gray-500 dark:text-gray-400">{user.funcao}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Painel Direito (Chat Ativo) */}
                <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
                    {currentChat ? (
                        <>
                            <CardHeader className="flex flex-row items-center gap-3 p-3 border-b bg-white dark:bg-gray-800 shadow-sm">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{currentChat.receiver.nome.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h3 className="font-semibold">{currentChat.receiver.nome}</h3>
                            </CardHeader>
                            <ChatWindow messages={messages} currentUserId={currentUser.id} />
                            <div className="p-4 border-t flex gap-2 bg-white dark:bg-gray-800">
                                <Textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Digite sua mensagem..." rows={1} className="resize-none rounded-full bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400" onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                                <Button onClick={handleSendMessage} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full flex-shrink-0">
                                    <Send className="h-4 w-4"/>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
                            <MessageSquare className="h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold">Zelos Suporte</h3>
                            <p>Selecione uma conversa para começar.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

// --- INTERFACE USUÁRIO ---
const UserChatInterface = ({ currentUser }) => {
    const [chatState, setChatState] = useState('initial');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [admin, setAdmin] = useState(null);
    const [conversationId, setConversationId] = useState(null);

    useEffect(() => {
        const findAdminAndConversation = async () => {
            try {
                const users = await apiRequest('/api/support/users');
                const firstAdmin = users.find(u => u.funcao === 'admin');
                if (firstAdmin) {
                    setAdmin(firstAdmin);
                    const convos = await apiRequest(`/api/support/conversations/${currentUser.id}`);
                    const existingConvo = convos.find(c => (c.user1_id === firstAdmin.id || c.user2_id === firstAdmin.id));
                    if(existingConvo) {
                        setConversationId(existingConvo.id);
                        const msgs = await apiRequest(`/api/support/messages/${existingConvo.id}`);
                        setMessages(msgs);
                        if(msgs.length > 0) setChatState('live_chat');
                    }
                }
            } catch(error) { console.error("Erro ao buscar admin:", error); }
        };
        findAdminAndConversation();
    }, [currentUser.id]);

    const handleQuestionClick = (faqItem) => {
        const userMessage = { id: `faq-${Date.now()}`, sender_id: currentUser.id, message: faqItem.question, timestamp: new Date().toISOString() };
        const botMessage = { id: `faq-ans-${Date.now()}`, sender_id: -1, message: faqItem.answer, timestamp: new Date().toISOString() };
        setMessages([userMessage, botMessage]);
        setChatState('answered');
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !admin) return;
        
        await apiRequest('/api/support/messages', {
            method: 'POST',
            body: JSON.stringify({ sender_id: currentUser.id, receiver_id: admin.id, message: newMessage }),
        });
        setNewMessage("");

        const convos = await apiRequest(`/api/support/conversations/${currentUser.id}`);
        const existingConvo = convos.find(c => (c.user1_id === admin.id || c.user2_id === admin.id));
        if (existingConvo) {
            setConversationId(existingConvo.id);
            const msgs = await apiRequest(`/api/support/messages/${existingConvo.id}`);
            setMessages(msgs);
        }
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-4rem)] p-4 flex justify-center items-center">
                <div className="w-full max-w-4xl h-full flex gap-4">
                    <div className="w-1/3 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-blue-500"/> Ajuda Rápida</h2>
                        <div className="space-y-2">
                            {faqData.map(item => (
                                <Button key={item.question} variant="outline" className="w-full justify-start h-auto py-3 text-left" onClick={() => handleQuestionClick(item)}>{item.question}</Button>
                            ))}
                            <Button className="w-full" onClick={() => setChatState('live_chat')}>Falar com um atendente</Button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
                       {(chatState === 'initial') && (
                           <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 p-4">
                             <MessageSquare className="h-12 w-12 mb-4" />
                             <h3 className="text-lg font-semibold">Bem-vindo ao Suporte</h3>
                             <p>Selecione um tópico ao lado ou inicie uma conversa com nossa equipe.</p>
                           </div>
                       )}
                       {(chatState === 'answered' || chatState === 'live_chat') && (
                            <>
                                <ChatWindow messages={messages} currentUserId={currentUser.id} />
                                {chatState === 'answered' && (
                                    <div className="p-4 text-center border-t bg-white dark:bg-gray-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Esta resposta foi útil?</p>
                                        <Button onClick={() => setChatState('live_chat')}>Não, preciso de ajuda</Button>
                                    </div>
                                )}
                                {chatState === 'live_chat' && (
                                    <div className="p-4 border-t flex gap-2 bg-white dark:bg-gray-800">
                                        <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Digite sua mensagem..." rows={1} className="resize-none rounded-full bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400" onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                                        <Button onClick={handleSendMessage} disabled={!admin} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full flex-shrink-0">
                                            <Send className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

// --- COMPONENTE REUTILIZÁVEL PARA MENSAGENS ---
const ChatWindow = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef(null);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100/50 dark:bg-gray-900/50">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender_id !== currentUserId && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{msg.sender_id === -1 ? <Bot /> : 'S'}</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm
                        ${msg.sender_id === currentUserId ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none shadow-sm'}`}>
                        <p>{msg.message}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">
                            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};