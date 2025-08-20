import { create } from '../config/database.js';
import bcrypt from 'bcryptjs';

const createTestUsers = async () => {
  try {
    console.log('Criando usuários de teste...');

    const users = [
      {
        nome: 'Administrador',
        email: 'admin@zelos.com',
        senha: await bcrypt.hash('senha123', 10),
        funcao: 'admin',
        status: 'ativo'
      },
      {
        nome: 'Técnico Suporte',
        email: 'tecnico@zelos.com',
        senha: await bcrypt.hash('senha123', 10),
        funcao: 'tecnico',
        status: 'ativo'
      },
      {
        nome: 'Usuário Comum',
        email: 'usuario@zelos.com',
        senha: await bcrypt.hash('senha123', 10),
        funcao: 'usuario',
        status: 'ativo'
      }
    ];

    for (const user of users) {
      const userId = await create('usuarios', user);
      console.log(`Usuário criado: ${user.nome} (ID: ${userId})`);
    }

    console.log('Usuários de teste criados com sucesso!');
    console.log('\nCredenciais de teste:');
    console.log('Admin: admin@zelos.com / senha123');
    console.log('Técnico: tecnico@zelos.com / senha123');
    console.log('Usuário: usuario@zelos.com / senha123');

  } catch (error) {
    console.error('Erro ao criar usuários de teste:', error);
  }
};

// Executar o script
createTestUsers();
