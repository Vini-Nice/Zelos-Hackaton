"use client";

import { useState } from "react";
import { Send, MessageSquare, HelpCircle, Phone, Mail, Clock, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

const perguntasSuporte = [
  {
    id: 1,
    pergunta: "Preciso de ajuda",
    opcoes: [
      {
        texto: "Não consigo fazer login",
        acao: "login",
        descricao: "Problemas para acessar o sistema"
      },
      {
        texto: "Esqueci minha senha",
        acao: "senha",
        descricao: "Recuperação de credenciais"
      },
      {
        texto: "Problema com chamado",
        acao: "chamado",
        descricao: "Dúvidas sobre chamados"
      },
      {
        texto: "Erro no sistema",
        acao: "erro",
        descricao: "Bugs ou problemas técnicos"
      },
      {
        texto: "Outro problema",
        acao: "outro",
        descricao: "Outras questões"
      }
    ]
  },
  {
    id: 2,
    pergunta: "Como abrir um chamado?",
    opcoes: [
      {
        texto: "Passo a passo",
        acao: "tutorial",
        descricao: "Guia visual completo"
      },
      {
        texto: "Tipos de chamado",
        acao: "tipos",
        descricao: "Categorias disponíveis"
      },
      {
        texto: "Prioridades",
        acao: "prioridades",
        descricao: "Como definir urgência"
      }
    ]
  },
  {
    id: 3,
    pergunta: "Acompanhar chamados",
    opcoes: [
      {
        texto: "Ver status",
        acao: "status",
        descricao: "Como verificar progresso"
      },
      {
        texto: "Adicionar comentários",
        acao: "comentarios",
        descricao: "Como interagir com técnicos"
      },
      {
        texto: "Cancelar chamado",
        acao: "cancelar",
        descricao: "Quando e como cancelar"
      }
    ]
  },
  {
    id: 4,
    pergunta: "Configurações da conta",
    opcoes: [
      {
        texto: "Alterar senha",
        acao: "alterar_senha",
        descricao: "Procedimento de segurança"
      },
      {
        texto: "Dados pessoais",
        acao: "dados",
        descricao: "Atualizar informações"
      },
      {
        texto: "Notificações",
        acao: "notificacoes",
        descricao: "Configurar alertas"
      }
    ]
  }
];

const respostasAutomaticas = {
  login: {
    titulo: "Problemas de Login",
    solucoes: [
      "Verifique se está usando o usuário correto",
      "Confirme se a senha está correta",
      "Limpe o cache do navegador",
      "Tente em uma aba anônima",
      "Verifique se a conta não foi bloqueada"
    ],
    contato: true
  },
  senha: {
    titulo: "Recuperação de Senha",
    solucoes: [
      "Clique em 'Esqueci minha senha' na tela de login",
      "Digite seu email cadastrado",
      "Verifique sua caixa de entrada",
      "O link expira em 1 hora",
      "Crie uma nova senha forte"
    ],
    contato: false
  },
  chamado: {
    titulo: "Dúvidas sobre Chamados",
    solucoes: [
      "Chamados são atendidos por ordem de prioridade",
      "Tempo médio de resposta: 24h",
      "Você pode acompanhar o status em 'Meus Chamados'",
      "Adicione comentários para mais detalhes",
      "Use categorias específicas para melhor atendimento"
    ],
    contato: true
  },
  erro: {
    titulo: "Problemas Técnicos",
    solucoes: [
      "Atualize a página (F5)",
      "Limpe o cache do navegador",
      "Verifique sua conexão com a internet",
      "Tente em outro navegador",
      "Se persistir, entre em contato conosco"
    ],
    contato: true
  },
  outro: {
    titulo: "Outras Questões",
    solucoes: [
      "Para questões específicas, use o chat ao lado",
      "Email: suporte@zelos.com",
      "Telefone: (11) 99999-9999",
      "Horário: Segunda a Sexta, 8h às 18h",
      "WhatsApp: (11) 99999-9999"
    ],
    contato: true
  }
};

export default function Suporte() {
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [chatAtivo, setChatAtivo] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");

  const handleOpcaoClick = (acao) => {
    setRespostaSelecionada(acao);
  };

  const voltarPergunta = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1);
      setRespostaSelecionada(null);
    }
  };

  const proximaPergunta = () => {
    if (perguntaAtual < perguntasSuporte.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
      setRespostaSelecionada(null);
    }
  };

  const iniciarChat = () => {
    setChatAtivo(true);
    setMensagens([
      {
        de: "suporte",
        texto: "Olá! Como posso ajudá-lo hoje?",
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const enviarMensagem = () => {
    if (novaMensagem.trim() === "") return;
    
    const mensagemUsuario = {
      de: "usuário",
      texto: novaMensagem,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMensagens([...mensagens, mensagemUsuario]);
    setNovaMensagem("");
    
    // Simular resposta automática
    setTimeout(() => {
      const respostas = [
        "Entendo sua questão. Deixe-me verificar isso para você.",
        "Vou encaminhar sua solicitação para nossa equipe técnica.",
        "Essa é uma boa pergunta. Deixe-me explicar o processo.",
        "Vou verificar as informações e retorno em breve.",
        "Obrigado pelo contato. Nossa equipe está analisando."
      ];
      
      const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
      
      const mensagemSuporte = {
        de: "suporte",
        texto: respostaAleatoria,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMensagens(prev => [...prev, mensagemSuporte]);
    }, 1000);
  };

  const resetarSuporte = () => {
    setPerguntaAtual(0);
    setRespostaSelecionada(null);
    setChatAtivo(false);
    setMensagens([]);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Suporte ao Usuário</h1>
            <p className="text-gray-600 dark:text-gray-300">Escolha a opção que melhor descreve sua necessidade</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sistema de Perguntas */}
            <div className="space-y-6">
              {!chatAtivo && (
                <>
                  {/* Navegação */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={voltarPergunta}
                      disabled={perguntaAtual === 0}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Anterior
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {perguntaAtual + 1} de {perguntasSuporte.length}
                    </span>
                    <button
                      onClick={proximaPergunta}
                      disabled={perguntaAtual === perguntasSuporte.length - 1}
                      className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </div>

                  {/* Pergunta Atual */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                      <HelpCircle className="h-6 w-6 mr-3 text-blue-600" />
                      {perguntasSuporte[perguntaAtual].pergunta}
                    </h2>
                    
                    <div className="space-y-3">
                      {perguntasSuporte[perguntaAtual].opcoes.map((opcao, index) => (
                        <button
                          key={index}
                          onClick={() => handleOpcaoClick(opcao.acao)}
                          className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {opcao.texto}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {opcao.descricao}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resposta Automática */}
                  {respostaSelecionada && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        {respostasAutomaticas[respostaSelecionada].titulo}
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        {respostasAutomaticas[respostaSelecionada].solucoes.map((solucao, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{solucao}</p>
                          </div>
                        ))}
                      </div>

                      {respostasAutomaticas[respostaSelecionada].contato && (
                        <button
                          onClick={iniciarChat}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          <MessageSquare className="h-5 w-5 inline mr-2" />
                          Falar com Suporte
                        </button>
                      )}

                      <button
                        onClick={() => setRespostaSelecionada(null)}
                        className="w-full mt-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Voltar às Opções
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Botão de Reset */}
              {!chatAtivo && (
                <button
                  onClick={resetarSuporte}
                  className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Começar Novamente
                </button>
              )}
            </div>

            {/* Chat de Suporte */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
              {chatAtivo ? (
                <>
                  {/* Cabeçalho do chat */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                      Chat com Suporte
                    </h3>
                    <button
                      onClick={() => setChatAtivo(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Área do chat */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {mensagens.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.de === "usuário" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-xl ${
                            m.de === "usuário" 
                              ? "bg-blue-500 text-white rounded-br-none" 
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{m.texto}</p>
                          <span className="text-xs text-gray-400 dark:text-gray-300 mt-1 block text-right">
                            {m.hora}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de nova mensagem */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                    <input
                      type="text"
                      placeholder="Escreva sua mensagem..."
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 dark:text-gray-100"
                      value={novaMensagem}
                      onChange={(e) => setNovaMensagem(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                    />
                    <button
                      onClick={enviarMensagem}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Chat de Suporte
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Use as opções ao lado para encontrar respostas rápidas ou inicie um chat para atendimento personalizado.
                    </p>
                    <button
                      onClick={iniciarChat}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Iniciar Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Outras Formas de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Email</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">suporte@zelos.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Telefone</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">(11) 99999-9999</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Horário</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Seg-Sex: 8h às 18h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
