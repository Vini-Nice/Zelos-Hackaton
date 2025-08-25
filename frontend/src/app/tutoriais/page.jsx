"use client";

import { useState } from "react";
import { Book, Video, FileText, Download, Play, ExternalLink, CheckCircle, Clock, Star } from "lucide-react";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

const recursos = [
  {
    id: 1,
    titulo: "Manual do Usuário Completo",
    descricao: "Guia detalhado para utilizar todas as funcionalidades do sistema Zelos. Inclui screenshots, passo a passo e dicas de uso.",
    icone: <FileText className="h-6 w-6 text-blue-600" />,
    tipo: "PDF",
    tamanho: "2.4 MB",
    duracao: "15 min de leitura",
    nivel: "Iniciante",
    downloads: 1247,
    avaliacao: 4.8,
    conteudo: [
      "Introdução ao sistema Zelos",
      "Configuração inicial da conta",
      "Criação e gestão de chamados",
      "Sistema de notificações",
      "Configurações de perfil",
      "Dicas de segurança",
      "Solução de problemas comuns"
    ]
  },
  {
    id: 2,
    titulo: "Tutoriais em Vídeo",
    descricao: "Coleção de vídeos passo a passo mostrando como resolver problemas comuns e usar funcionalidades avançadas.",
    icone: <Video className="h-6 w-6 text-green-600" />,
    tipo: "Vídeo",
    tamanho: "Vários formatos",
    duracao: "45 min total",
    nivel: "Todos os níveis",
    downloads: 892,
    avaliacao: 4.9,
    conteudo: [
      "Como abrir um chamado (3 min)",
      "Acompanhamento de status (5 min)",
      "Configurações de conta (8 min)",
      "Uso do sistema de busca (4 min)",
      "Relatórios e estatísticas (10 min)",
      "Configurações de notificação (7 min)",
      "Dicas de produtividade (8 min)"
    ]
  },
  {
    id: 3,
    titulo: "Dicas de Boas Práticas",
    descricao: "Recomendações comprovadas para usar o sistema de forma eficiente, segura e produtiva.",
    icone: <Book className="h-6 w-6 text-purple-600" />,
    tipo: "Artigo",
    tamanho: "1.8 MB",
    duracao: "10 min de leitura",
    nivel: "Intermediário",
    downloads: 567,
    avaliacao: 4.7,
    conteudo: [
      "Organização eficiente de chamados",
      "Comunicação clara com técnicos",
      "Priorização inteligente de solicitações",
      "Backup e segurança de dados",
      "Integração com outros sistemas",
      "Relatórios e métricas úteis",
      "Troubleshooting avançado"
    ]
  },
  {
    id: 4,
    titulo: "Guia de Solução de Problemas",
    descricao: "Manual prático para resolver os problemas mais comuns sem precisar abrir chamados.",
    icone: <CheckCircle className="h-6 w-6 text-orange-600" />,
    tipo: "Guia Interativo",
    tamanho: "3.1 MB",
    duracao: "20 min de leitura",
    nivel: "Intermediário",
    downloads: 734,
    avaliacao: 4.6,
    conteudo: [
      "Problemas de login e acesso",
      "Erros de sistema comuns",
      "Problemas de performance",
      "Questões de conectividade",
      "Problemas de upload/download",
      "Configurações de navegador",
      "Limpeza de cache e cookies"
    ]
  },
  {
    id: 5,
    titulo: "Treinamento para Administradores",
    descricao: "Curso completo para usuários com perfil administrativo, incluindo gestão de usuários e relatórios.",
    icone: <Star className="h-6 w-6 text-yellow-600" />,
    tipo: "Curso Online",
    tamanho: "5.2 MB",
    duracao: "2 horas",
    nivel: "Avançado",
    downloads: 234,
    avaliacao: 4.9,
    conteudo: [
      "Gestão de usuários e permissões",
      "Configurações do sistema",
      "Relatórios e analytics",
      "Backup e manutenção",
      "Segurança e auditoria",
      "Integração com LDAP",
      "Monitoramento de performance"
    ]
  },
  {
    id: 6,
    titulo: "API e Integrações",
    descricao: "Documentação técnica para desenvolvedores que precisam integrar o sistema Zelos com outras aplicações.",
    icone: <ExternalLink className="h-6 w-6 text-red-600" />,
    tipo: "Documentação Técnica",
    tamanho: "4.7 MB",
    duracao: "1 hora",
    nivel: "Avançado",
    downloads: 156,
    avaliacao: 4.5,
    conteudo: [
      "Visão geral da API REST",
      "Autenticação e autorização",
      "Endpoints principais",
      "Exemplos de integração",
      "Webhooks e notificações",
      "Rate limiting e quotas",
      "Tratamento de erros"
    ]
  }
];

const dicasRapidas = [
  {
    pergunta: "Como acessar tutoriais offline?",
    resposta: "Baixe os PDFs disponíveis na seção de recursos. Todos os materiais são otimizados para impressão e visualização offline.",
    categoria: "Acesso"
  },
  {
    pergunta: "Como navegar pelo manual?",
    resposta: "Use o índice lateral para acessar tópicos específicos rapidamente. O manual também possui busca por palavras-chave.",
    categoria: "Navegação"
  },
  {
    pergunta: "Dicas para resolver problemas comuns",
    resposta: "Verifique primeiro a seção de FAQ antes de abrir um chamado. Muitos problemas têm soluções documentadas.",
    categoria: "Solução"
  },
  {
    pergunta: "Como baixar vídeos para assistir offline?",
    resposta: "Os vídeos podem ser baixados em formato MP4. Clique no botão de download ao lado de cada tutorial.",
    categoria: "Download"
  },
  {
    pergunta: "Existe suporte para dispositivos móveis?",
    resposta: "Sim! Todos os tutoriais são responsivos e podem ser acessados de smartphones e tablets.",
    categoria: "Mobile"
  },
  {
    pergunta: "Como avaliar os tutoriais?",
    resposta: "Após usar um tutorial, você pode dar uma avaliação de 1 a 5 estrelas. Sua opinião nos ajuda a melhorar.",
    categoria: "Feedback"
  }
];

export default function Tutoriais() {
  const [recursoSelecionado, setRecursoSelecionado] = useState(null);
  const [categoriaDicas, setCategoriaDicas] = useState("todos");

  const categoriasDicas = ["todos", "Acesso", "Navegação", "Solução", "Download", "Mobile", "Feedback"];

  const dicasFiltradas = categoriaDicas === "todos" 
    ? dicasRapidas 
    : dicasRapidas.filter(item => item.categoria === categoriaDicas);

  const handleDownload = (recurso) => {
    // Simular download
    alert(`Iniciando download de: ${recurso.titulo}`);
  };

  const handleVisualizar = (recurso) => {
    setRecursoSelecionado(recurso);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Recursos e Tutoriais</h1>
              <p className="text-gray-600 dark:text-gray-300">Aprenda a usar o sistema Zelos com nossos materiais educativos</p>
            </div>
            <UserAvatar name="Usuário" avatar="" size={40} />
          </div>

          {/* Cards de recursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recursos.map((recurso) => (
              <div
                key={recurso.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">{recurso.icone}</div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{recurso.titulo}</h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{recurso.descricao}</p>
                
                {/* Metadados */}
                <div className="space-y-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Tipo: {recurso.tipo}</span>
                    <span>{recurso.tamanho}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {recurso.duracao}
                    </span>
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      {recurso.avaliacao}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nível: {recurso.nivel}</span>
                    <span>{recurso.downloads} downloads</span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVisualizar(recurso)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleDownload(recurso)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dicas rápidas / FAQ */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Dicas Rápidas</h2>
              
              {/* Filtros de categoria */}
              <div className="flex gap-2">
                {categoriasDicas.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaDicas(cat)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      categoriaDicas === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {cat === "todos" ? "Todas" : cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {dicasFiltradas.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{item.pergunta}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.resposta}</p>
                    </div>
                    <span className="ml-4 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {item.categoria}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal de detalhes do recurso */}
          {recursoSelecionado && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    {recursoSelecionado.icone}
                    <span className="ml-2">{recursoSelecionado.titulo}</span>
                  </h2>
                  <button
                    onClick={() => setRecursoSelecionado(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">{recursoSelecionado.descricao}</p>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Conteúdo do Tutorial:</h3>
                  <div className="space-y-2">
                    {recursoSelecionado.conteudo.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(recursoSelecionado)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Baixar {recursoSelecionado.tipo}
                  </button>
                  <button
                    onClick={() => setRecursoSelecionado(null)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
