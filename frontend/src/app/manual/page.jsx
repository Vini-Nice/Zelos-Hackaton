"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronRight,
  FileText,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

export default function ManualFAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    "como-abrir-chamado": true,
    "tipos-chamados": false,
    "acompanhar-chamado": false,
    "problemas-comuns": false,
    "dicas-uso": false
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const faqData = [
    {
      id: "como-abrir-chamado",
      title: "Como abrir um chamado?",
      icon: FileText,
      content: [
        "1. Acesse a página 'Abrir Chamado' no menu lateral",
        "2. Preencha o título do chamado de forma clara e objetiva",
        "3. Selecione a categoria mais apropriada para o problema",
        "4. Defina a prioridade baseada na urgência",
        "5. Preencha suas informações de contato",
        "6. Descreva detalhadamente o problema",
        "7. Anexe arquivos relevantes se necessário",
        "8. Clique em 'Enviar Chamado'"
      ]
    },
    {
      id: "tipos-chamados",
      title: "Quais são os tipos de chamados?",
      icon: HelpCircle,
      content: [
        "• Problema Técnico: Falhas em equipamentos ou sistemas",
        "• Software: Problemas com aplicativos ou programas",
        "• Hardware: Defeitos em equipamentos físicos",
        "• Rede/Internet: Problemas de conectividade",
        "• Acesso/Senha: Dificuldades para acessar sistemas",
        "• Outro: Questões que não se enquadram nas categorias acima"
      ]
    },
    {
      id: "acompanhar-chamado",
      title: "Como acompanhar um chamado?",
      icon: CheckCircle,
      content: [
        "1. Acesse 'Meus Chamados' no menu lateral",
        "2. Visualize a lista de todos os seus chamados",
        "3. Clique no chamado desejado para ver detalhes",
        "4. Acompanhe o status e atualizações",
        "5. Adicione comentários se necessário",
        "6. Receba notificações por email sobre mudanças"
      ]
    },
    {
      id: "problemas-comuns",
      title: "Problemas comuns e soluções",
      icon: AlertCircle,
      content: [
        "Problema: Não consigo fazer login",
        "Solução: Verifique se as credenciais estão corretas e se a conta não foi bloqueada",
        "",
        "Problema: Sistema lento",
        "Solução: Feche aplicativos desnecessários e limpe o cache do navegador",
        "",
        "Problema: Impressora não funciona",
        "Solução: Verifique se está ligada, conectada e com papel"
      ]
    },
    {
      id: "dicas-uso",
      title: "Dicas para uso eficiente",
      icon: Lightbulb,
      content: [
        "• Sempre descreva o problema de forma clara e objetiva",
        "• Inclua mensagens de erro exatas quando disponíveis",
        "• Anexe capturas de tela ou documentos relevantes",
        "• Informe se o problema afeta outros usuários",
        "• Forneça um número de contato para esclarecimentos",
        "• Use categorias e prioridades adequadas"
      ]
    }
  ];

  const filteredFAQ = faqData.filter(faq =>
    faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.content.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Manual e FAQ Inclusivos</h1>
            </div>
          </div>
          <p className="text-gray-600">Encontre respostas para suas dúvidas e aprenda a usar o sistema de forma eficiente</p>
        </div>

        {/* Barra de Busca */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Busque por palavras-chave, problemas ou funcionalidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Navegação */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navegação Rápida</h3>
              <nav className="space-y-2">
                {faqData.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => {
                      document.getElementById(faq.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
                  >
                    <div className="flex items-center space-x-2">
                      <faq.icon className="h-4 w-4" />
                      <span>{faq.title}</span>
                    </div>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Links Úteis</h4>
                <div className="space-y-2">
                  <a 
                    href="/tutoriais" 
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Tutoriais em Vídeo</span>
                  </a>
                  <a 
                    href="/ajuda" 
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Contato Suporte</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            {searchTerm && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800">
                  <strong>Resultados da busca:</strong> {filteredFAQ.length} resultado(s) encontrado(s) para "{searchTerm}"
                </p>
              </div>
            )}

            <div className="space-y-6">
              {(searchTerm ? filteredFAQ : faqData).map((faq) => (
                <div 
                  key={faq.id}
                  id={faq.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(faq.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <faq.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{faq.title}</h3>
                      </div>
                      {expandedSections[faq.id] ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedSections[faq.id] && (
                    <div className="px-6 pb-6">
                      <div className="space-y-3">
                        {faq.content.map((item, index) => (
                          <div key={index} className="text-gray-700 leading-relaxed">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Seção de Contato */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                  Não encontrou o que procurava?
                </h3>
                <p className="text-blue-800 mb-4">
                  Nossa equipe de suporte está sempre pronta para ajudar. Entre em contato conosco!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/abrir-chamado"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Abrir Novo Chamado</span>
                  </a>
                  <a
                    href="/ajuda"
                    className="inline-flex items-center space-x-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Falar com Suporte</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
