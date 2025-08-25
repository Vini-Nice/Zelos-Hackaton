// import express from 'express';
// const router = express.Router();
// import mysql from 'mysql2/promise';
// import dbConfig from '../config/database.js';



// // Buscar notificações de um usuário
// router.get('/:usuarioId', async (req, res) => {
//   try {
//     const { usuarioId } = req.params;
//     const connection = await mysql.createConnection(dbConfig);

//     const [rows] = await connection.execute(
//       'SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY criado_em DESC',
//       [usuarioId]
//     );

//     await connection.end();
//     res.json(rows);
//   } catch (error) {
//     console.error('Erro ao buscar notificações:', error);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

// // Marcar notificação como lida
// router.put('/:id/ler', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const connection = await mysql.createConnection(dbConfig);

//     await connection.execute(
//       'UPDATE notificacoes SET lida = TRUE WHERE id = ?',
//       [id]
//     );

//     await connection.end();
//     res.json({ success: true, message: 'Notificação marcada como lida' });
//   } catch (error) {
//     console.error('Erro ao marcar notificação como lida:', error);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

// // Marcar todas as notificações de um usuário como lidas
// router.put('/:usuarioId/ler-todas', async (req, res) => {
//   try {
//     const { usuarioId } = req.params;
//     const connection = await mysql.createConnection(dbConfig);

//     await connection.execute(
//       'UPDATE notificacoes SET lida = TRUE WHERE usuario_id = ?',
//       [usuarioId]
//     );

//     await connection.end();
//     res.json({ success: true, message: 'Todas as notificações marcadas como lidas' });
//   } catch (error) {
//     console.error('Erro ao marcar notificações como lidas:', error);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

// // Deletar uma notificação
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const connection = await mysql.createConnection(dbConfig);

//     await connection.execute(
//       'DELETE FROM notificacoes WHERE id = ?',
//       [id]
//     );

//     await connection.end();
//     res.json({ success: true, message: 'Notificação deletada com sucesso' });
//   } catch (error) {
//     console.error('Erro ao deletar notificação:', error);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

// // Criar uma nova notificação
// router.post('/', async (req, res) => {
//   try {
//     const { usuario_id, tipo, titulo, mensagem, dados_adicional } = req.body;
//     const connection = await mysql.createConnection(dbConfig);

//     const [result] = await connection.execute(
//       'INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, dados_adicional) VALUES (?, ?, ?, ?, ?)',
//       [usuario_id, tipo, titulo, mensagem, JSON.stringify(dados_adicional)]
//     );

//     await connection.end();
//     res.json({
//       success: true,
//       message: 'Notificação criada com sucesso',
//       id: result.insertId
//     });
//   } catch (error) {
//     console.error('Erro ao criar notificação:', error);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

// // Contar notificações não lidas de um usuário
// router.get('/:usuarioId/nao-lidas', async (req, res) => {
//   try {
//     const { usuarioId } = req.params;
//     const connection = await mysql.createConnection(dbConfig);

//     const [rows] = await connection.execute(
//       'SELECT COUNT(*) as count FROM notificacoes WHERE usuario_id = ? AND lida = FALSE',
//       [usuarioId]
//     );

//     await connection.end();
//     res.json({ count: rows[0].count });
//   } catch (error) {
//     console.error('Erro ao contar notificações não lidas:', error);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

// export default router;
