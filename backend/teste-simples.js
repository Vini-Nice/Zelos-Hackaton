import express from 'express';
import cors from 'cors';
import session from 'express-session';

const app = express();
const porta = 8081; // Porta diferente para não conflitar

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'teste-simples',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Rota de teste
app.get('/teste', (req, res) => {
  res.json({ message: 'Servidor de teste funcionando!' });
});

// Usuários de teste
app.get('/usuarios-teste', (req, res) => {
  const usuarios = [
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
    usuarios,
    credenciais: {
      senha: 'password',
      observacao: 'Use "password" como senha para todos os usuários'
    }
  });
});

// Login simples
app.post('/login-local', (req, res) => {
  const { username, password } = req.body;
  
  if (password === 'password' && ['admin', 'usuario', 'tecnico'].includes(username)) {
    const usuarios = {
      admin: { displayName: 'Administrador', email: 'admin@zelos.com', funcao: 'admin' },
      usuario: { displayName: 'Usuário Teste', email: 'usuario@zelos.com', funcao: 'usuario' },
      tecnico: { displayName: 'Técnico Suporte', email: 'tecnico@zelos.com', funcao: 'tecnico' }
    };

    const usuario = usuarios[username];
    
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
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Verificar autenticação
app.get('/check-auth-local', (req, res) => {
  if (req.session.user) {
    return res.json({
      authenticated: true,
      user: req.session.user
    });
  }
  res.status(401).json({ authenticated: false });
});

// Logout
app.post('/logout-local', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.json({ message: 'Logout realizado com sucesso' });
  });
});

app.listen(porta, () => {
  console.log(`🚀 Servidor de teste rodando na porta ${porta}`);
  console.log(`✅ Teste: http://localhost:${porta}/teste`);
  console.log(`✅ Usuários: http://localhost:${porta}/usuarios-teste`);
  console.log(`✅ Login: POST http://localhost:${porta}/login-local`);
});
