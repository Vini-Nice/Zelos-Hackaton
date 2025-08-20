import { create } from '../config/database.js';

const createTestPools = async () => {
  try {
    console.log('Criando pools de teste...');

    const pools = [
      {
        titulo: 'externo',
        descricao: 'Chamados relacionados a serviços externos',
        status: 'ativo'
      },
      {
        titulo: 'manutencao',
        descricao: 'Chamados de manutenção de equipamentos',
        status: 'ativo'
      },
      {
        titulo: 'apoio_tecnico',
        descricao: 'Chamados de suporte técnico geral',
        status: 'ativo'
      },
      {
        titulo: 'limpeza',
        descricao: 'Chamados relacionados a limpeza e organização',
        status: 'ativo'
      }
    ];

    for (const pool of pools) {
      const poolId = await create('pool', pool);
      console.log(`Pool criado: ${pool.titulo} (ID: ${poolId})`);
    }

    console.log('Pools de teste criados com sucesso!');

  } catch (error) {
    console.error('Erro ao criar pools de teste:', error);
  }
};

// Executar o script
createTestPools();
