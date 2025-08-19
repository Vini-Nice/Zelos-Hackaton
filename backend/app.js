import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import authRotas from './routes/authRotas.js';
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
}).on('error', (err) => {
  console.error('Erro ao iniciar:', err);
});

// 8. Encerramento elegante
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Servidor encerrado');
  });
});