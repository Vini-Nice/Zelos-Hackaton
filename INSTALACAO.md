# 🚀 Guia de Instalação Rápida - Zelos

Este guia te ajudará a configurar e executar o sistema Zelos em poucos minutos.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- MySQL 8.0+ instalado e rodando
- Git instalado

## ⚡ Instalação Rápida

### 1. Clone e configure o projeto
```bash
git clone <url-do-repositorio>
cd Zelos-Hackaton
```

### 2. Configure o banco de dados
```bash
# Acesse o MySQL
mysql -u root -p

# Crie o banco e execute o script
CREATE DATABASE zelo;
USE zelo;
source bd/init.sql;
exit;
```

### 3. Configure o backend
```bash
cd backend
npm install
npm run setup  # Cria usuários e pools de teste
npm run dev    # Inicia o servidor na porta 8080
```

### 4. Configure o frontend (em outro terminal)
```bash
cd frontend
npm install
npm run dev    # Inicia o frontend na porta 3000
```

### 5. Acesse o sistema
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 👥 Usuários de Teste

Após executar `npm run setup`, você pode fazer login com:

| Email | Senha | Função |
|-------|-------|--------|
| admin@zelos.com | senha123 | Administrador |
| tecnico@zelos.com | senha123 | Técnico |
| usuario@zelos.com | senha123 | Usuário |

## 🔧 Configurações Opcionais

### Variáveis de Ambiente (Backend)
Crie um arquivo `.env` na pasta `backend/`:
```env
PORT=8080
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=zelo
```

### Variáveis de Ambiente (Frontend)
Crie um arquivo `.env.local` na pasta `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🐛 Solução de Problemas

### Erro de conexão com banco
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `backend/config/database.js`

### Erro de CORS
- Verifique se o backend está rodando na porta 8080
- Confirme se o frontend está acessando a URL correta

### Erro de módulos não encontrados
- Execute `npm install` nas pastas `backend/` e `frontend/`
- Verifique se está usando Node.js 18+

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todos os pré-requisitos estão instalados
2. Confirme se o banco de dados foi criado corretamente
3. Verifique os logs do console para erros específicos
4. Abra uma issue no repositório com detalhes do erro

## 🎯 Próximos Passos

Após a instalação bem-sucedida:
1. Faça login com um dos usuários de teste
2. Explore as funcionalidades do sistema
3. Teste a criação de chamados
4. Verifique as diferentes permissões por função
