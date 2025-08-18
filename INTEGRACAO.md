# 🚀 Integração Backend-Frontend - Sistema Zelos

## 📋 Visão Geral

Este documento descreve a integração completa entre o backend Node.js/Express e o frontend Next.js/React do Sistema Zelos.

## 🏗️ Arquitetura da Integração

### Backend (Porta 8080)
- **Express.js** com autenticação LDAP
- **MySQL** como banco de dados
- **Passport.js** para sessões
- **CORS** configurado para frontend
- **APIs RESTful** para todas as entidades

### Frontend (Porta 3000)
- **Next.js 15** com React 19
- **Tailwind CSS** para estilização
- **Context API** para gerenciamento de estado
- **Hooks personalizados** para operações CRUD
- **Proteção de rotas** com autenticação

## 🔧 Configuração do Ambiente

### 1. Backend
```bash
cd backend
npm install
```

### 2. Frontend
```bash
cd frontend
npm install
```

### 3. Variáveis de Ambiente
Criar arquivo `.env.local` no frontend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

## 🚀 Como Executar

### 1. Iniciar Backend
```bash
cd backend
npm start
# ou
node app.js
```

### 2. Iniciar Frontend
```bash
cd frontend
npm run dev
```

## 🔐 Sistema de Autenticação

### **DUAS OPÇÕES DE LOGIN:**

#### **1. Autenticação LDAP (Produção)**
- **Rota:** `/auth/login`
- **Configuração:** Servidor LDAP real
- **Uso:** Ambiente de produção

#### **2. Autenticação Local (Desenvolvimento)**
- **Rota:** `/auth-local/login-local`
- **Configuração:** Usuários de teste pré-configurados
- **Uso:** Ambiente de desenvolvimento e testes

### **Credenciais de Teste Disponíveis:**

| Usuário | Senha | Nome | Função |
|---------|-------|------|--------|
| `admin` | `password` | Administrador | Admin |
| `usuario` | `password` | Usuário Teste | Usuário |
| `tecnico` | `password` | Técnico Suporte | Técnico |

### Fluxo de Login
1. Usuário acessa `/login`
2. Escolhe entre **LDAP** ou **Desenvolvimento**
3. Preenche credenciais
4. Backend valida e cria sessão
5. Usuário redirecionado para dashboard

### Proteção de Rotas
- Todas as páginas (exceto login) são protegidas
- Componente `ProtectedRoute` verifica autenticação
- Redirecionamento automático para `/login` se não autenticado

## 📡 APIs Implementadas

### Autenticação LDAP
- `POST /auth/login` - Login LDAP
- `POST /auth/logout` - Logout
- `GET /auth/check-auth` - Verificar status

### Autenticação Local (Desenvolvimento)
- `POST /auth-local/login-local` - Login local
- `POST /auth-local/logout-local` - Logout local
- `GET /auth-local/check-auth-local` - Verificar status
- `GET /auth-local/usuarios-teste` - Listar usuários de teste

### Chamados
- `GET /api/chamados` - Listar todos
- `GET /api/chamados/:id` - Obter por ID
- `POST /api/chamados` - Criar novo
- `PUT /api/chamados/:id` - Atualizar
- `DELETE /api/chamados/:id` - Excluir

### Usuários
- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/:id` - Obter por ID
- `POST /api/usuarios` - Criar novo
- `PUT /api/usuarios/:id` - Atualizar
- `DELETE /api/usuarios/:id` - Excluir

## 🎯 Funcionalidades Implementadas

### ✅ Concluído
- [x] Sistema de autenticação LDAP
- [x] Sistema de autenticação local para desenvolvimento
- [x] Proteção de rotas
- [x] Dashboard principal integrado
- [x] Formulário de abertura de chamados
- [x] Gerenciamento de estado global
- [x] Tratamento de erros
- [x] Sistema de notificações
- [x] Menu de usuário com logout
- [x] Hooks personalizados para CRUD

### 🚧 Em Desenvolvimento
- [ ] Página de meus chamados
- [ ] Upload de arquivos
- [ ] Sistema de comentários
- [ ] Filtros e busca
- [ ] Paginação

### 📋 Pendente
- [ ] Páginas administrativas
- [ ] Relatórios e gráficos
- [ ] Sistema de notificações push
- [ ] Auditoria de ações
- [ ] Backup automático

## 🛠️ Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   ├── Notification/
│   │   └── Header/Header.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useChamados.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── authLocal.js
│   │   ├── chamados.js
│   │   └── usuarios.js
│   └── app/
│       ├── login/page.jsx
│       ├── abrir-chamado/page.jsx
│       └── page.jsx

backend/
├── routes/
│   ├── authRotas.js (LDAP)
│   ├── authLocalRotas.js (Desenvolvimento)
│   ├── usuarioRoutes.js
│   ├── chamadoRoutes.js
│   └── ...
└── app.js
```

## 🔍 Como Testar a Integração

### **1. Teste Rápido com Credenciais de Teste**
1. Acesse `http://localhost:3000/login`
2. Clique em **"Desenvolvimento"**
3. Use qualquer usuário de teste:
   - **Usuário:** `admin` | **Senha:** `password`
   - **Usuário:** `usuario` | **Senha:** `password`
   - **Usuário:** `tecnico` | **Senha:** `password`
4. Clique em **"Usar"** para preencher automaticamente
5. Clique em **"Entrar"**
6. Verifique redirecionamento para dashboard

### **2. Teste de Autenticação LDAP**
1. Acesse `http://localhost:3000/login`
2. Clique em **"LDAP"**
3. Use credenciais LDAP válidas
4. Verifique redirecionamento para dashboard

### **3. Teste de Criação de Chamado**
1. Faça login no sistema
2. Acesse "Abrir Chamado"
3. Preencha o formulário
4. Verifique criação no backend

### **4. Teste de Proteção de Rotas**
1. Acesse uma rota protegida sem login
2. Verifique redirecionamento para `/login`
3. Faça login e acesse novamente

## 🐛 Solução de Problemas

### Erro de CORS
```javascript
// Backend: app.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Erro de Autenticação
- **LDAP:** Verificar configuração LDAP no backend
- **Local:** Verificar se backend está rodando
- **Geral:** Confirmar credenciais de teste
- **Geral:** Verificar logs do servidor

### Erro de Conexão
- Verificar se backend está rodando na porta 8080
- Confirmar variáveis de ambiente
- Verificar firewall/antivírus

## 📚 Próximos Passos

### Curto Prazo (1-2 semanas)
1. Implementar página de meus chamados
2. Adicionar upload de arquivos
3. Sistema de comentários em chamados

### Médio Prazo (1 mês)
1. Páginas administrativas
2. Sistema de relatórios
3. Melhorias de UX/UI

### Longo Prazo (2-3 meses)
1. Sistema de notificações push
2. Integração com outros sistemas
3. Mobile app

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste a integração
5. Faça commit e push
6. Abra um Pull Request

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique este documento
2. Consulte os logs do console
3. Verifique a documentação das APIs
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ para o Hackaton Zelos**
