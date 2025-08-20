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
      if (funcao) usuarioData.funcao = funcao;
      if (status) usuarioData.status = status;

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

      // Comparação de senha usando hash
      const senhaCorreta = await compararSenha(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha incorreta' });
      }


      res.status(200).json({
        mensagem: 'Login bem-sucedido',
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, funcao: usuario.funcao }
      });

    } catch (error) {
      res.status(500).json({ erro: 'Erro ao fazer login' });
    }
  }

};

export default usuarioController;