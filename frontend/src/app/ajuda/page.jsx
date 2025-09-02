"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import { Book, MessageSquare, FileText, Clock, HelpCircle, Settings, User, Shield, Moon, Sun, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Dados (mantidos como no original)
const topicos = [
    { id: 1, titulo: "Como abrir um chamado", descricao: "Passo a passo para criar um novo chamado no sistema.", icone: <FileText className="h-6 w-6 text-primary" />, rota: "/abrir-chamado", conteudo: ["1. Acesse a página 'Abrir Chamado' no menu lateral.", "2. Preencha o título do chamado (seja específico).", "3. Descreva detalhadamente o problema ou solicitação.", "4. Selecione a categoria apropriada.", "5. Clique em 'Enviar Chamado'.", "6. Anote o número do chamado para acompanhamento."] },
    { id: 2, titulo: "Acompanhar chamados", descricao: "Saiba como acompanhar o status dos seus chamados.", icone: <Clock className="h-6 w-6 text-accent" />, rota: "/meus-chamados", conteudo: ["1. Acesse 'Meus Chamados' no menu lateral.", "2. Visualize todos os seus chamados criados.", "3. O status é atualizado em tempo real pelos técnicos.", "4. Adicione comentários se necessário para fornecer mais detalhes."] },
    { id: 3, titulo: "Manual do Sistema", descricao: "Documentação detalhada sobre as funcionalidades.", icone: <Book className="h-6 w-6 text-green-500" />, rota: "/ajuda/manual-faq", conteudo: ["• Manual completo do usuário.", "• Guias visuais e tutoriais em vídeo.", "• Soluções para problemas comuns.", "• Glossário de termos técnicos."] },
    { id: 4, titulo: "Contato com Suporte", descricao: "Formas de entrar em contato com nossa equipe.", icone: <MessageSquare className="h-6 w-6 text-purple-500" />, rota: "/ajuda/contato-suporte", conteudo: ["• Email: suporte@sistema.com", "• Telefone: (11) 99999-9999", "• Horário: Segunda a Sexta, 8h às 18h."] },
    { id: 5, titulo: "Configurações da Conta", descricao: "Como gerenciar suas preferências e dados.", icone: <Settings className="h-6 w-6 text-orange-500" />, rota: "/perfil", conteudo: ["• Alterar senha.", "• Atualizar dados pessoais.", "• Configurar notificações.", "• Preferências de privacidade."] },
    { id: 6, titulo: "Segurança e Privacidade", descricao: "Informações sobre proteção de dados.", icone: <Shield className="h-6 w-6 text-red-500" />, rota: "/ajuda/seguranca", conteudo: ["• Política de privacidade.", "• Termos de uso.", "• Dicas de segurança para sua conta.", "• Como reportar um incidente de segurança."] },
];
const faqExpandido = [
    { pergunta: "Como redefinir minha senha?", resposta: "Acesse seu perfil e clique em 'Redefinir senha'. Um link será enviado para seu email cadastrado.", categoria: "Conta" },
    { pergunta: "Como abrir um chamado urgente?", resposta: "Ao criar o chamado, selecione a prioridade 'Alta' e descreva claramente a urgência da situação.", categoria: "Chamados" },
    { pergunta: "Quanto tempo leva para um chamado ser atendido?", resposta: "O tempo de resposta (SLA) varia conforme a prioridade: Alta (até 4h), Média (até 24h), Baixa (até 72h).", categoria: "Chamados" },
    { pergunta: "Como cancelar um chamado?", resposta: "Apenas chamados com status 'Pendente' podem ser cancelados. Caso contrário, entre em contato com o suporte.", categoria: "Chamados" },
    { pergunta: "Como funciona o sistema de notificações?", resposta: "Você recebe notificações por email e no sistema sobre atualizações importantes nos seus chamados.", categoria: "Sistema" },
];

export default function Ajuda() {
  const router = useRouter();
  const [topicoSelecionado, setTopicoSelecionado] = useState(null);
  const [categoriaFaq, setCategoriaFaq] = useState("todos");
  const [theme, setTheme] = useState("light");

  // Gerenciamento do tema
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const categoriasFaq = ["todos", "Conta", "Chamados", "Sistema"];

  const faqFiltrado = categoriaFaq === "todos" 
    ? faqExpandido 
    : faqExpandido.filter((item) => item.categoria === categoriaFaq);

  const handleTopicoClick = (topico) => {
    if (topico.rota) {
      router.push(topico.rota);
    } else {
      setTopicoSelecionado(topico);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-7 w-7 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold">Central de Ajuda</h1>
            </div>
            <div className="flex items-center space-x-4">
              
   
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">Como podemos ajudar?</h2>
                <p className="mt-2 text-muted-foreground">Encontre respostas rápidas ou explore nossos guias.</p>
            </div>
            <div className="relative w-full max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="text" placeholder="Pesquise por palavras-chave..." className="pl-12 h-12 text-base"/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topicos.map((topico) => (
                <Card
                  key={topico.id}
                  onClick={() => handleTopicoClick(topico)}
                  className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {topico.icone}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{topico.titulo}</h3>
                        <p className="text-sm text-muted-foreground">{topico.descricao}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <HelpCircle className="h-6 w-6 mr-3 text-primary" />
                    Perguntas Frequentes
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {categoriasFaq.map((cat) => (
                      <Button key={cat} onClick={() => setCategoriaFaq(cat)} variant={categoriaFaq === cat ? "default" : "outline"} size="sm">
                        {cat === "todos" ? "Todas" : cat}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {faqFiltrado.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-background/50">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                        <div className="flex-1">
                            <h3 className="font-medium mb-1">{item.pergunta}</h3>
                            <p className="text-sm text-muted-foreground">{item.resposta}</p>
                        </div>
                        <Badge variant="secondary" className="mt-2 sm:mt-0">{item.categoria}</Badge>
                        </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {topicoSelecionado && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                <Card className="bg-card max-w-lg w-full max-h-[90vh] flex flex-col">
                  <CardContent className="p-6 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        {topicoSelecionado.icone}
                        <span className="ml-3">{topicoSelecionado.titulo}</span>
                      </h2>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setTopicoSelecionado(null)}>
                        <span className="text-2xl font-light">×</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{topicoSelecionado.descricao}</p>
                    <div className="space-y-3 prose prose-sm dark:prose-invert">
                      {topicoSelecionado.conteudo.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}