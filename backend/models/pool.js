import { create, readAll, read, update, deleteRecord } from '../config/database.js';

const listarPools = async () => {
  try {
    return await readAll('pool');
  } catch (error) {
    console.error('Erro ao listar pools:', error);
    throw error;
  }
};

const obterPoolPorId = async (id) => {
  try {
    return await read('pool', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter pool por ID:', error);
    throw error;
  }
};

const criarPool = async (poolData) => {
  try {
    return await create('pool', poolData);
  } catch (error) {
    console.error('Erro ao criar pool:', error);
    throw error;
  }
};

const atualizarPool = async (id, poolData) => {
  try {
    await update('pool', poolData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atualizar pool:', error);
    throw error;
  }
};

const excluirPool = async (id) => {
  try {
    await deleteRecord('pool', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao excluir pool:', error);
    throw error;
  }
};

export { listarPools, obterPoolPorId, criarPool, atualizarPool, excluirPool };