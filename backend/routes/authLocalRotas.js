import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Usuários de teste para desenvolvimento
const usuariosTeste = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    displayName: 'Administrador',
    email: 'admin@zelos.com',
    funcao: 'admin'
  },
  {
    id: 2,
    username: 'usuario',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    displayName: 'Usuário Teste',
    email: 'usuario@zelos.com',
    funcao: 'usuario'
  },
  {
    id: 3,
    username: 'tecnico',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    displayName: 'Técnico Suporte',
    email: 'tecnico@zelos.com',
    funcao: 'tecnico'
  }
];

// Login local para desenvolvimento
router.post('/login-local', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Usuário e senha são obrigatórios' 
      });
    }

    // Buscar usuário
    const usuario = usuariosTeste.find(u => u.username === username);
    
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado' 
      });
    }

    // Verificar senha (todas as senhas são 'password')
    const senhaValida = password === 'password' || await bcrypt.compare(password, usuario.password);
    
    if (!senhaValida) {
      return res.status(401).json({ 
        error: 'Senha incorreta' 
      });
    }

    // Criar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        username: usuario.username,
        funcao: usuario.funcao 
      },
      'zelos-secret-key-dev',
      { expiresIn: '24h' }
    );

    // Criar sessão
    req.session.user = {
      id: usuario.id,
      username: usuario.username,
      displayName: usuario.displayName,
      email: usuario.email,
      funcao: usuario.funcao
    };

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        username: usuario.username,
        displayName: usuario.displayName,
        email: usuario.email,
        funcao: usuario.funcao
      },
      token
    });

  } catch (error) {
    console.error('Erro no login local:', error);
    res.status(500).json({ 
      error: 'Erro interno no servidor' 
    });
  }
});

// Verificar autenticação local
router.get('/check-auth-local', (req, res) => {
  if (req.session.user) {
    return res.json({
      authenticated: true,
      user: req.session.user
    });
  }
  res.status(401).json({ authenticated: false });
});

// Logout local
router.post('/logout-local', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Erro ao fazer logout' 
      });
    }
    res.json({ message: 'Logout realizado com sucesso' });
  });
});

// Listar usuários de teste
router.get('/usuarios-teste', (req, res) => {
  const usuarios = usuariosTeste.map(u => ({
    username: u.username,
    displayName: u.displayName,
    email: u.email,
    funcao: u.funcao
  }));
  
  res.json({
    message: 'Usuários de teste disponíveis',
    usuarios,
    credenciais: {
      senha: 'password',
      observacao: 'Use "password" como senha para todos os usuários'
    }
  });
});

export default router;
