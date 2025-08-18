import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import authRotas from './routes/authRotas.js';
import authLocalRotas from './routes/authLocalRotas.js';
import passport from './config/ldap.js';
// Novas importações
import usuarioRoutes from './routes/usuarioRoutes.js';
import poolRoutes from './routes/poolRoutes.js';
import chamadoRoutes from './routes/chamadoRoutes.js';
import apontamentoRoutes from './routes/apontamentoRoutes.js';
import poolTecnicoRoutes from './routes/poolTecnicoRoutes.js';

// 1. Carrega variáveis de ambiente PRIMEIRO
dotenv.config();

// 2. Configuração básica do Express
const app = express();
const porta = process.env.PORT || 8080;

// 3. Middlewares essenciais com tratamento de erros
try {
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());
  
  app.use(session({
    secret: 'sJYMmuCB2Z187XneUuaOVYTVUlxEOb2K94tFZy370HjOY7T7aiCKvwhNQpQBYL9e',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  // 4. Inicialização segura do Passport
  if (!passport) {
    throw new Error('Passport não foi importado corretamente');
  }
  app.use(passport.initialize());
  app.use(passport.session());

} catch (err) {
  console.error('Erro na configuração inicial:', err);
  process.exit(1);
}

// 5. Rotas
app.use('/auth', authRotas);
app.use('/auth-local', authLocalRotas); // Rotas de autenticação local para desenvolvimento

// Rota de teste para verificar se está funcionando
app.get('/teste-auth-local', (req, res) => {
  res.json({ 
    message: 'Rota de teste funcionando!',
    timestamp: new Date().toISOString(),
    rotas: ['/auth-local/login-local', '/auth-local/usuarios-teste', '/auth-local/check-auth-local']
  });
});

// Rotas de autenticação local diretas (backup)
app.get('/usuarios-teste', (req, res) => {
  const usuariosTeste = [
    {
      username: 'admin',
      displayName: 'Administrador',
      email: 'admin@zelos.com',
      funcao: 'admin'
    },
    {
      username: 'usuario',
      displayName: 'Usuário Teste',
      email: 'usuario@zelos.com',
      funcao: 'usuario'
    },
    {
      username: 'tecnico',
      displayName: 'Técnico Suporte',
      email: 'tecnico@zelos.com',
      funcao: 'tecnico'
    }
  ];
  
  res.json({
    message: 'Usuários de teste disponíveis',
    usuarios: usuariosTeste,
    credenciais: {
      senha: 'password',
      observacao: 'Use "password" como senha para todos os usuários'
    }
  });
});

// Login local direto (backup)
app.post('/login-local', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Usuário e senha são obrigatórios' 
    });
  }

  // Verificar credenciais simples
  if (password === 'password' && ['admin', 'usuario', 'tecnico'].includes(username)) {
    const usuarios = {
      admin: { displayName: 'Administrador', email: 'admin@zelos.com', funcao: 'admin' },
      usuario: { displayName: 'Usuário Teste', email: 'usuario@zelos.com', funcao: 'usuario' },
      tecnico: { displayName: 'Técnico Suporte', email: 'tecnico@zelos.com', funcao: 'tecnico' }
    };

    const usuario = usuarios[username];
    
    // Criar sessão
    req.session.user = {
      username: username,
      displayName: usuario.displayName,
      email: usuario.email,
      funcao: usuario.funcao
    };

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        username: username,
        displayName: usuario.displayName,
        email: usuario.email,
        funcao: usuario.funcao
      }
    });
  } else {
    res.status(401).json({ 
      error: 'Credenciais inválidas' 
    });
  }
});

// Verificar autenticação local direta (backup)
app.get('/check-auth-local', (req, res) => {
  if (req.session.user) {
    return res.json({
      authenticated: true,
      user: req.session.user
    });
  }
  res.status(401).json({ authenticated: false });
});

// Logout local direto (backup)
app.post('/logout-local', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Erro ao fazer logout' 
      });
    }
    res.json({ message: 'Logout realizado com sucesso' });
  });
});

// Novas rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/chamados', chamadoRoutes);
app.use('/api/apontamentos', apontamentoRoutes);
app.use('/api/pool_tecnico', poolTecnicoRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online' });
});

// 6. Tratamento de erros robusto
process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Exceção não capturada:', err);
  process.exit(1);
});

// 7. Inicialização do servidor com verificação
const server = app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
  console.log(`✅ Rotas de autenticação local disponíveis em /auth-local`);
  console.log(`✅ Rotas de backup disponíveis em /usuarios-teste, /login-local, etc.`);
  console.log(`✅ Rota de teste disponível em /teste-auth-local`);
}).on('error', (err) => {
  console.error('Erro ao iniciar:', err);
});

// 8. Encerramento elegante
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Servidor encerrado');
  });
});