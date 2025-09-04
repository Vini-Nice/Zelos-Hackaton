"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, ArrowLeft, Sun, Moon } from "lucide-react";
// Importações de componentes de UI (ex: shadcn/ui)
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// --- DADOS MOCADOS ---
// Perguntas e opções para a seção de Ajuda Rápida
const perguntasSuporte = [
    { id: 1, pergunta: "Preciso de ajuda com o sistema", opcoes: [{ texto: "Não consigo fazer login", acao: "login", descricao: "Problemas para acessar o sistema" }, { texto: "Esqueci minha senha", acao: "senha", descricao: "Recuperação de credenciais" }, { texto: "Problema com um chamado", acao: "chamado", descricao: "Dúvidas sobre chamados" }, { texto: "Encontrei um erro", acao: "erro", descricao: "Bugs ou problemas técnicos" }, { texto: "Outra questão", acao: "outro", descricao: "Falar diretamente com suporte" }] },
    { id: 2, pergunta: "Como funcionam os chamados?", opcoes: [{ texto: "Passo a passo para abrir", acao: "tutorial", descricao: "Guia visual completo" }, { texto: "Tipos de chamado", acao: "tipos", descricao: "Categorias disponíveis" }, { texto: "Prioridades e SLAs", acao: "prioridades", descricao: "Como definir a urgência" }] },
    { id: 3, pergunta: "Como acompanhar meus chamados?", opcoes: [{ texto: "Verificar o status", acao: "status", descricao: "Como acompanhar o progresso" }, { texto: "Adicionar comentários", acao: "comentarios", descricao: "Como interagir com técnicos" }, { texto: "Cancelar um chamado", acao: "cancelar", descricao: "Quando e como cancelar" }] },
];

// Respostas pré-definidas para as opções da Ajuda Rápida
const respostasAutomaticas = {
    login: { titulo: "Problemas de Login", solucoes: ["Verifique se seu usuário e senha estão corretos.", "Confirme se a tecla Caps Lock não está ativada.", "Tente limpar o cache e os cookies do seu navegador.", "Se o problema persistir, entre em contato para verificarmos um possível bloqueio."], contato: true },
    senha: { titulo: "Recuperação de Senha", solucoes: ["Na tela de login, clique em 'Esqueci minha senha'.", "Digite seu e-mail cadastrado e siga as instruções.", "Você receberá um link para redefinir sua senha.", "O link de recuperação é válido por 1 hora."], contato: false },
    outro: { titulo: "Falar com Suporte", solucoes: ["Para questões não listadas, nossa equipe está pronta para ajudar no chat.", "Por favor, inicie o chat e descreva seu problema em detalhes."], contato: true },
    // Adicione outras respostas automáticas aqui...
};

export default function Suporte() {
  // --- ESTADOS DO COMPONENTE ---
  const [perguntaAtual, setPerguntaAtual] = useState(0); // Índice da pergunta na Ajuda Rápida
  const [resposta, setResposta] = useState(null); // Resposta automática selecionada
  const [chatAtivo, setChatAtivo] = useState(false); // Controla a visibilidade do chat
  const [mensagens, setMensagens] = useState([]); // Array com as mensagens do chat
  const [novaMensagem, setNovaMensagem] = useState(""); // Valor do input de nova mensagem
  const [theme, setTheme] = useState("light"); // Estado para o tema (light/dark)
  const chatEndRef = useRef(null); // Referência para o final do contêiner de chat

  // --- EFEITOS (useEffect) ---
  // Efeito para rolar o chat para a última mensagem
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]); // Roda sempre que o array de mensagens for atualizado
  
  // Efeito para inicializar o tema com base no que está no HTML
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []); // Roda apenas uma vez, na montagem do componente
  
  // --- FUNÇÕES E MANIPULADORES DE EVENTOS ---
  // Alterna o tema entre claro e escuro
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  // Define qual resposta automática exibir com base na ação do botão
  const handleOpcaoClick = (acao) => setResposta(respostasAutomaticas[acao] || respostasAutomaticas["outro"]);
  
  // Funções de navegação para a Ajuda Rápida
  const voltarPergunta = () => { if (perguntaAtual > 0) { setPerguntaAtual(p => p - 1); setResposta(null); }};
  const proximaPergunta = () => { if (perguntaAtual < perguntasSuporte.length - 1) { setPerguntaAtual(p => p + 1); setResposta(null); }};
  const resetarSuporte = () => { setPerguntaAtual(0); setResposta(null); setChatAtivo(false); };

  // Inicia o chat e adiciona a primeira mensagem de boas-vindas
  const iniciarChat = () => {
    setChatAtivo(true);
    setMensagens([{ de: "suporte", texto: "Olá! Sou o assistente virtual. Como posso ajudá-lo hoje?", hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
  };

  // Envia uma nova mensagem para o chat
  const enviarMensagem = () => {
    if (novaMensagem.trim() === "") return; // Impede o envio de mensagens vazias

    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Adiciona a mensagem do usuário ao estado
    setMensagens(prev => [...prev, { de: "usuario", texto: novaMensagem, hora: horaAtual }]);
    setNovaMensagem(""); // Limpa o campo de input

    // Simula uma resposta do suporte após 1 segundo
    setTimeout(() => {
      const respostaSuporte = { de: "suporte", texto: "Obrigado pelo seu contato. Um de nossos atendentes irá verificar sua mensagem em breve.", hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
      setMensagens(prev => [...prev, respostaSuporte]);
    }, 1000);
  };

  // --- RENDERIZAÇÃO DO COMPONENTE (JSX) ---
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold">Suporte</h1>
          
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card da Esquerda: Ajuda Rápida */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Ajuda Rápida</CardTitle>
                <CardDescription>Encontre soluções para os problemas mais comuns.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                {!resposta ? (
                  <>
                    {/* Exibe as perguntas e opções */}
                    <div className="p-4 border rounded-lg bg-secondary/50">
                      <h3 className="font-semibold mb-3">{perguntasSuporte[perguntaAtual].pergunta}</h3>
                      <div className="space-y-2">
                        {perguntasSuporte[perguntaAtual].opcoes.map((opcao) => (
                          <button key={opcao.acao} onClick={() => handleOpcaoClick(opcao.acao)} className="w-full text-left p-3 border rounded-md hover:bg-accent transition-colors">
                            <p className="font-medium">{opcao.texto}</p>
                            <p className="text-sm text-muted-foreground">{opcao.descricao}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Navegação entre as perguntas */}
                    <div className="flex items-center justify-between text-sm">
                      <Button variant="ghost" onClick={voltarPergunta} disabled={perguntaAtual === 0}><ArrowLeft className="h-4 w-4 mr-2" /> Anterior</Button>
                      <span>{perguntaAtual + 1} de {perguntasSuporte.length}</span>
                      <Button variant="ghost" onClick={proximaPergunta} disabled={perguntaAtual === perguntasSuporte.length - 1}>Próxima <ArrowLeft className="h-4 w-4 ml-2 rotate-180" /></Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Exibe a resposta automática selecionada */}
                    <div className="p-4 border rounded-lg bg-secondary/50">
                      <h3 className="font-semibold mb-3">{resposta.titulo}</h3>
                      <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                        {resposta.solucoes.map((sol, i) => <li key={i}>{sol}</li>)}
                      </ul>
                      <div className="flex gap-2 mt-4">
                        {resposta.contato && <Button onClick={iniciarChat}><MessageSquare className="h-4 w-4 mr-2" /> Falar com Suporte</Button>}
                        <Button variant="outline" onClick={() => setResposta(null)}>Ver outras opções</Button>
                      </div>
                    </div>
                  </>
                )}
                {/* Botão para reiniciar a ajuda */}
                <div className="pt-4 mt-auto border-t">
                  <Button variant="secondary" className="w-full" onClick={resetarSuporte}>Começar Novamente</Button>
                </div>
              </CardContent>
            </Card>

            {/* Card da Direita: Chat de Suporte */}
            <Card className="flex flex-col h-[70vh]">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Chat de Suporte</CardTitle>
                    <CardDescription>Converse com nossa equipe em tempo real.</CardDescription>
                </div>
                {chatAtivo && <Button variant="destructive" size="sm" onClick={() => setChatAtivo(false)}>Encerrar</Button>}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {chatAtivo ? (
                  <>
                    {/* Área de exibição das mensagens */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {mensagens.map((m, i) => (
                        <div key={i} className={`flex ${m.de === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${m.de === 'usuario' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                            <p className="text-sm">{m.texto}</p>
                            <span className="text-xs text-muted-foreground/80 mt-1 block text-right">{m.hora}</span>
                          </div>
                        </div>
                      ))}
                      {/* Elemento invisível para o qual a tela rola */}
                      <div ref={chatEndRef} />
                    </div>
                    {/* Área de input da mensagem */}
                    <div className="p-4 border-t flex gap-2">
                      <Input type="text" placeholder="Escreva sua mensagem..." value={novaMensagem} onChange={(e) => setNovaMensagem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enviarMensagem()} className="flex-1"/>
                      <Button onClick={enviarMensagem}><Send className="h-4 w-4" /></Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Tela inicial do chat */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                      <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="font-semibold">Bem-vindo ao nosso chat!</h3>
                      <p className="text-muted-foreground text-sm mt-1">Use a ajuda rápida ou inicie uma conversa.</p>
                      <Button onClick={iniciarChat} className="mt-4">Iniciar Chat</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}