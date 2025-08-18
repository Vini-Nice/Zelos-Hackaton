import { create, readAll, read, update, deleteRecord, compare } from '../config/database.js';
import bcrypt from 'bcryptjs';

const listarUsuarios = async () => {
  try {
    return await readAll('usuarios');
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    throw error;
  }
};

const obterUsuarioPorId = async (id) => {
  try {
    return await read('usuarios', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter usuário por ID:', error);
    throw error;
  }
};

const obterUsuarioPorEmail = async (email) => {
  try {
    return await read('usuarios', `email = '${email}'`);
  } catch (error) {
    console.error('Erro ao obter usuário por email:', error);
    throw error;
  }
};

const criarUsuario = async (usuarioData) => {
  try {
    const hashedPassword = await bcrypt.hash(usuarioData.senha, 10);
    const usuarioComSenha = { ...usuarioData, senha: hashedPassword };
    return await create('usuarios', usuarioComSenha);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

const atualizarUsuario = async (id, usuarioData) => {
  try {
    if (usuarioData.senha) {
      usuarioData.senha = await bcrypt.hash(usuarioData.senha, 10);
    }
    await update('usuarios', usuarioData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

const excluirUsuario = async (id) => {
  try {
    await deleteRecord('usuarios', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};

const compararSenha = async (senha, hash) => {
  try {
    return await compare(senha, hash);
  } catch (error) {
    console.error('Erro ao comparar senha:', error);
    throw error;
  }
};

export { listarUsuarios, obterUsuarioPorId, obterUsuarioPorEmail, criarUsuario, atualizarUsuario, excluirUsuario, compararSenha };