"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import { Book, MessageSquare, FileText, Clock, HelpCircle, Settings, User, Shield, Moon, Sun, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const topicos = [
  {
    id: 1,
    titulo: "Como abrir um chamado",
    descricao: "Passo a passo para criar um novo chamado no sistema.",
    icone: <FileText className="h-6 w-6 text-primary dark:text-primary/80" />,
    rota: "/ajuda/abrir-chamado",
    conteudo: [
      "1. Acesse a página 'Abrir Chamado' no menu lateral",
      "2. Preencha o título do chamado (seja específico)",
      "3. Descreva detalhadamente o problema ou solicitação",
      "4. Selecione a categoria apropriada",
      "5. Clique em 'Enviar Chamado'",
      "6. Anote o número do chamado para acompanhamento",
    ],
  },
  {
    id: 2,
    titulo: "Acompanhar chamados",
    descricao: "Saiba como acompanhar o status dos seus chamados.",
    icone: <Clock className="h-6 w-6 text-accent dark:text-accent/80" />,
    rota: "/ajuda/acompanhar-chamados",
    conteudo: [
      "1. Acesse 'Meus Chamados' no menu lateral",
      "2. Visualize todos os seus chamados criados",
      "3. O status é atualizado automaticamente pelos técnicos",
      "4. Receba notificações sobre mudanças de status",
      "5. Adicione comentários se necessário",
    ],
  },
  {
    id: 3,
    titulo: "Manual / FAQ inclusivo",
    descricao: "Documentação detalhada e perguntas frequentes do sistema.",
    icone: <Book className="h-6 w-6 text-green-500 dark:text-green-400" />,
    rota: "/ajuda/manual-faq",
    conteudo: [
      "• Manual completo do usuário",
      "• Perguntas frequentes organizadas por categoria",
      "• Guias visuais e tutoriais",
      "• Soluções para problemas comuns",
      "• Glossário de termos técnicos",
    ],
  },
  {
    id: 4,
    titulo: "Contato com suporte",
    descricao: "Formas de entrar em contato direto com a equipe de suporte.",
    icone: <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    rota: "/ajuda/contato-suporte",
    conteudo: [
      "• Chat em tempo real com suporte",
      "• Email: suporte@zelos.com",
      "• Telefone: (11) 99999-9999",
      "• Horário: Segunda a Sexta, 8h às 18h",
      "• WhatsApp: (11) 99999-9999",
    ],
  },
  {
    id: 5,
    titulo: "Configurações da conta",
    descricao: "Como gerenciar suas preferências e dados pessoais.",
    icone: <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
    rota: "/ajuda/configuracoes",
    conteudo: [
      "• Alterar senha",
      "• Atualizar dados pessoais",
      "• Configurar notificações",
      "• Preferências de idioma",
      "• Configurações de privacidade",
    ],
  },
  {
    id: 6,
    titulo: "Segurança e privacidade",
    descricao: "Informações sobre proteção de dados e segurança.",
    icone: <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />,
    rota: "/ajuda/seguranca",
    conteudo: [
      "• Política de privacidade",
      "• Termos de uso",
      "• Dicas de segurança da conta",
      "• Proteção de dados pessoais",
      "• Relatório de incidentes",
    ],
  },
];

const faqExpandido = [
  {
    pergunta: "Como redefinir minha senha?",
    resposta: "Acesse seu perfil e clique em 'Redefinir senha'. Um link será enviado para seu email cadastrado.",
    categoria: "Conta",
  },
  {
    pergunta: "Como abrir um chamado urgente?",
    resposta: "Ao criar o chamado, selecione a prioridade 'Alta' e descreva claramente a urgência da situação.",
    categoria: "Chamados",
  },
  {
    pergunta: "Posso alterar meus dados pessoais?",
    resposta: "Sim, vá até a seção 'Meu Perfil' para editar suas informações. Algumas alterações podem requerer aprovação.",
    categoria: "Conta",
  },
  {
    pergunta: "Quanto tempo leva para um chamado ser atendido?",
    resposta: "O tempo varia conforme a prioridade: Urgente (2h), Alta (24h), Média (48h), Baixa (72h).",
    categoria: "Chamados",
  },
  {
    pergunta: "Como cancelar um chamado?",
    resposta: "Apenas chamados com status 'Pendente' podem ser cancelados pelo usuário. Entre em contato com suporte se necessário.",
    categoria: "Chamados",
  },
  {
    pergunta: "Posso anexar arquivos aos chamados?",
    resposta: "Sim, você pode anexar imagens, documentos e outros arquivos relevantes ao criar ou atualizar um chamado.",
    categoria: "Chamados",
  },
  {
    pergunta: "Como funciona o sistema de notificações?",
    resposta: "Você recebe notificações por email e no sistema sobre mudanças de status, comentários e atualizações dos seus chamados.",
    categoria: "Sistema",
  },
  {
    pergunta: "O que fazer se esqueci meu usuário?",
    resposta: "Entre em contato com suporte informando seu email cadastrado. Eles poderão recuperar suas credenciais.",
    categoria: "Conta",
  },
];

export default function Ajuda() {
  const router = useRouter();
  const [topicoSelecionado, setTopicoSelecionado] = useState(null);
  const [categoriaFaq, setCategoriaFaq] = useState("todos");
  const [theme, setTheme] = useState("light");

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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    if (theme === "light") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background dark:bg-gray-900">
        {/* Header */}
        <header className="border-b border-border bg-card dark:bg-gray-800 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-8 w-8 text-primary dark:text-primary/80" />
              <h1 className="text-xl font-bold text-foreground dark:text-gray-100">Central de Ajuda</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
              <UserAvatar name="Usuário" avatar="" size={32} />
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Barra de pesquisa */}
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Pesquisar na ajuda..."
                className="pl-10 pr-4 py-3 border-gray-300 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-primary/80"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-gray-400" />
            </div>

            {/* Cards de tópicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topicos.map((topico) => (
                <Card
                  key={topico.id}
                  onClick={() => handleTopicoClick(topico)}
                  className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="mr-4">{topico.icone}</div>
                      <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">{topico.titulo}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">{topico.descricao}</p>
                    <div className="text-primary dark:text-primary/80 text-sm font-medium hover:underline">
                      {topico.rota ? "Ver mais →" : "Ver detalhes →"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Perguntas frequentes expandidas */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground dark:text-gray-100 flex items-center">
                    <HelpCircle className="h-6 w-6 mr-2 text-primary dark:text-primary/80" />
                    Perguntas Frequentes
                  </h2>
                  <div className="flex gap-2">
                    {categoriasFaq.map((cat) => (
                      <Button
                        key={cat}
                        onClick={() => setCategoriaFaq(cat)}
                        variant={categoriaFaq === cat ? "default" : "outline"}
                        className={`px-3 py-1 text-sm font-medium transition-colors ${
                          categoriaFaq === cat
                            ? "bg-primary text-white dark:bg-primary/80 dark:hover:bg-primary/70"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {cat === "todos" ? "Todas" : cat}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {faqFiltrado.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground dark:text-gray-100 mb-2">{item.pergunta}</h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">{item.resposta}</p>
                        </div>
                        <Badge className="ml-4 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs">
                          {item.categoria}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Modal de detalhes do tópico */}
            {topicoSelecionado && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="bg-white dark:bg-gray-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-foreground dark:text-gray-100 flex items-center">
                        {topicoSelecionado.icone}
                        <span className="ml-2">{topicoSelecionado.titulo}</span>
                      </h2>
                      <Button
                        variant="ghost"
                        onClick={() => setTopicoSelecionado(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        ✕
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">{topicoSelecionado.descricao}</p>
                    <div className="space-y-2">
                      {topicoSelecionado.conteudo.map((item, index) => (
                        <div key={index} className="text-sm text-foreground dark:text-gray-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}