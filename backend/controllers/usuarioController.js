import { listarUsuarios, obterUsuarioPorId, obterUsuarioPorEmail, criarUsuario, atualizarUsuario, excluirUsuario, compararSenha } from '../models/usuario.js';

const usuarioController = {
  async listarUsuarios(req, res) {
    try {
      const usuarios = await listarUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  },

  async obterUsuarioPorId(req, res) {
    try {
      const usuario = await obterUsuarioPorId(req.params.id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao obter usuário' });
    }
  },

  async criarUsuario(req, res) {
    try {
      const { nome, email, senha, funcao, status } = req.body;
      if (!nome || !email || !senha || !funcao) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando: nome, email, senha, funcao' });
      }
      
      // Validar função
      const funcoesValidas = ['admin', 'tecnico', 'aluno'];
      if (!funcoesValidas.includes(funcao)) {
        return res.status(400).json({ erro: 'Função deve ser: admin, tecnico ou aluno' });
      }
      
      const usuarioData = { nome, email, senha, funcao, status: status || 'ativo' };
      const id = await criarUsuario(usuarioData);
      res.status(201).json({ id, mensagem: 'Usuário criado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
  },

  async atualizarUsuario(req, res) {
    try {
      const { nome, email, senha, funcao, status } = req.body;
      const usuarioData = {};
      
      if (nome) usuarioData.nome = nome;
      if (email) usuarioData.email = email;
      if (senha) usuarioData.senha = senha;
      if (funcao) {
        const funcoesValidas = ['admin', 'tecnico', 'aluno'];
        if (!funcoesValidas.includes(funcao)) {
          return res.status(400).json({ erro: 'Função deve ser: admin, tecnico ou aluno' });
        }
        usuarioData.funcao = funcao;
      }
      if (status) {
        const statusValidos = ['ativo', 'inativo'];
        if (!statusValidos.includes(status)) {
          return res.status(400).json({ erro: 'Status deve ser: ativo ou inativo' });
        }
        usuarioData.status = status;
      }

      if (Object.keys(usuarioData).length === 0) {
        return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização' });
      }
      await atualizarUsuario(req.params.id, usuarioData);
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar usuário' });
    }
  },

  async excluirUsuario(req, res) {
    try {
      await excluirUsuario(req.params.id);
      res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao excluir usuário' });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      const usuario = await obterUsuarioPorEmail(email);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      // Verificar se o usuário está ativo
      if (usuario.status === 'inativo') {
        return res.status(401).json({ erro: 'Usuário inativo' });
      }

      // Comparação de senha usando hash
      const senhaCorreta = await compararSenha(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha incorreta' });
      }

      res.status(200).json({
        mensagem: 'Login bem-sucedido',
        usuario: { 
          id: usuario.id, 
          nome: usuario.nome, 
          email: usuario.email, 
          funcao: usuario.funcao,
          status: usuario.status 
        }
      });

    } catch (error) {
      res.status(500).json({ erro: 'Erro ao fazer login' });
    }
  },

  // Listar apenas técnicos
  async listarTecnicos(req, res) {
    try {
      const usuarios = await listarUsuarios();
      const tecnicos = usuarios.filter(u => u.funcao === 'tecnico' && u.status === 'ativo');
      res.status(200).json(tecnicos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar técnicos' });
    }
  },

  // Listar apenas alunos
  async listarAlunos(req, res) {
    try {
      const usuarios = await listarUsuarios();
      const alunos = usuarios.filter(u => u.funcao === 'aluno' && u.status === 'ativo');
      res.status(200).json(alunos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar alunos' });
    }
  }
};

export default usuarioController;