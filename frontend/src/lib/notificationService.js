// // Serviço para gerenciar notificações automaticamente
// export class NotificationService {
//   static async createNotification(notificationData) {
//     try {
//       const response = await fetch('/api/notificacoes', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(notificationData),
//       });

//       if (!response.ok) {
//         throw new Error('Erro ao criar notificação');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Erro ao criar notificação:', error);
//       throw error;
//     }
//   }

//   // Criar notificação de novo chamado
//   static async notifyNewChamado(chamadoId, titulo, usuarioId, tecnicoId) {
//     const notifications = [];

//     // Notificar o usuário que criou o chamado
//     if (usuarioId) {
//       notifications.push({
//         usuario_id: usuarioId,
//         tipo: 'status',
//         titulo: 'Chamado criado com sucesso',
//         mensagem: `Seu chamado "${titulo}" foi criado e está sendo analisado.`,
//         dados_adicional: {
//           chamado_id: chamadoId,
//           status: 'pendente'
//         }
//       });
//     }

//     // Notificar o técnico designado
//     if (tecnicoId) {
//       notifications.push({
//         usuario_id: tecnicoId,
//         tipo: 'chamado',
//         titulo: 'Novo chamado atribuído',
//         mensagem: `Você recebeu um novo chamado: "${titulo}"`,
//         dados_adicional: {
//           chamado_id: chamadoId,
//           status: 'pendente'
//         }
//       });
//     }

//     // Notificar todos os administradores
//     try {
//       const adminResponse = await fetch('/api/usuarios?funcao=admin');
//       if (adminResponse.ok) {
//         const admins = await adminResponse.json();
//         admins.forEach(admin => {
//           notifications.push({
//             usuario_id: admin.id,
//             tipo: 'chamado',
//             titulo: 'Novo chamado criado',
//             mensagem: `Novo chamado criado: "${titulo}"`,
//             dados_adicional: {
//               chamado_id: chamadoId,
//               status: 'pendente'
//             }
//           });
//         });
//       }
//     } catch (error) {
//       console.error('Erro ao buscar administradores:', error);
//     }

//     // Criar todas as notificações
//     for (const notification of notifications) {
//       try {
//         await this.createNotification(notification);
//       } catch (error) {
//         console.error('Erro ao criar notificação:', error);
//       }
//     }
//   }

//   // Notificar mudança de status do chamado
//   static async notifyStatusChange(chamadoId, titulo, novoStatus, usuarioId, tecnicoId) {
//     const notifications = [];

//     // Notificar o usuário sobre a mudança de status
//     if (usuarioId) {
//       let mensagem = '';
//       switch (novoStatus) {
//         case 'em andamento':
//           mensagem = `Seu chamado "${titulo}" foi iniciado pelo técnico.`;
//           break;
//         case 'concluido':
//           mensagem = `Seu chamado "${titulo}" foi concluído com sucesso.`;
//           break;
//         case 'cancelado':
//           mensagem = `Seu chamado "${titulo}" foi cancelado.`;
//           break;
//         default:
//           mensagem = `Status do seu chamado "${titulo}" foi alterado para "${novoStatus}".`;
//       }

//       notifications.push({
//         usuario_id: usuarioId,
//         tipo: 'status',
//         titulo: 'Status do chamado alterado',
//         mensagem,
//         dados_adicional: {
//           chamado_id: chamadoId,
//           status: novoStatus
//         }
//       });
//     }

//     // Notificar o técnico sobre a mudança
//     if (tecnicoId) {
//       notifications.push({
//         usuario_id: tecnicoId,
//         tipo: 'chamado',
//         titulo: 'Status do chamado alterado',
//         mensagem: `Status do chamado "${titulo}" alterado para "${novoStatus}".`,
//         dados_adicional: {
//           chamado_id: chamadoId,
//           status: novoStatus
//         }
//       });
//     }

//     // Notificar administradores sobre mudanças importantes
//     if (novoStatus === 'concluido' || novoStatus === 'cancelado') {
//       try {
//         const adminResponse = await fetch('/api/usuarios?funcao=admin');
//         if (adminResponse.ok) {
//           const admins = await adminResponse.json();
//           admins.forEach(admin => {
//             notifications.push({
//               usuario_id: admin.id,
//               tipo: 'chamado',
//               titulo: 'Chamado finalizado',
//               mensagem: `Chamado "${titulo}" foi ${novoStatus === 'concluido' ? 'concluído' : 'cancelado'}.`,
//               dados_adicional: {
//                 chamado_id: chamadoId,
//                 status: novoStatus
//               }
//             });
//           });
//         }
//       } catch (error) {
//         console.error('Erro ao buscar administradores:', error);
//       }
//     }

//     // Criar todas as notificações
//     for (const notification of notifications) {
//       try {
//         await this.createNotification(notification);
//       } catch (error) {
//         console.error('Erro ao criar notificação:', error);
//       }
//     }
//   }

//   // Notificar novo apontamento
//   static async notifyNewApontamento(apontamentoId, chamadoId, tecnicoId, descricao) {
//     const notifications = [];

//     // Notificar administradores sobre o novo apontamento
//     try {
//       const adminResponse = await fetch('/api/usuarios?funcao=admin');
//       if (adminResponse.ok) {
//         const admins = await adminResponse.json();
//         admins.forEach(admin => {
//           notifications.push({
//             usuario_id: admin.id,
//             tipo: 'apontamento',
//             titulo: 'Novo apontamento',
//             mensagem: `Técnico criou novo apontamento para chamado #${chamadoId}.`,
//             dados_adicional: {
//               apontamento_id: apontamentoId,
//               chamado_id: chamadoId,
//               tecnico_id: tecnicoId
//             }
//           });
//         });
//       }
//     } catch (error) {
//       console.error('Erro ao buscar administradores:', error);
//     }

//     // Criar todas as notificações
//     for (const notification of notifications) {
//       try {
//         await this.createNotification(notification);
//       } catch (error) {
//         console.error('Erro ao criar notificação:', error);
//       }
//     }
//   }

//   // Notificar finalização de apontamento
//   static async notifyApontamentoFinalizado(apontamentoId, chamadoId, tecnicoId, tempoExecucao) {
//     const notifications = [];

//     // Notificar administradores sobre o apontamento finalizado
//     try {
//       const adminResponse = await fetch('/api/usuarios?funcao=admin');
//       if (adminResponse.ok) {
//         const admins = await adminResponse.json();
//         admins.forEach(admin => {
//           notifications.push({
//             usuario_id: admin.id,
//             tipo: 'apontamento',
//             titulo: 'Apontamento finalizado',
//             mensagem: `Técnico finalizou apontamento para chamado #${chamadoId} em ${tempoExecucao} minutos.`,
//             dados_adicional: {
//               apontamento_id: apontamentoId,
//               chamado_id: chamadoId,
//               tecnico_id: tecnicoId,
//               tempo_execucao: tempoExecucao
//             }
//           });
//         });
//       }
//     } catch (error) {
//       console.error('Erro ao buscar administradores:', error);
//     }

//     // Criar todas as notificações
//     for (const notification of notifications) {
//       try {
//         await this.createNotification(notification);
//       } catch (error) {
//         console.error('Erro ao criar notificação:', error);
//       }
//     }
//   }
// }

// export default NotificationService;
