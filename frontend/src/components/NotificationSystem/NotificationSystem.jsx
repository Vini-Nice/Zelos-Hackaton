// "use client";

// import { useState, useEffect } from "react";
// import { Bell, X, CheckCircle, AlertTriangle, Info, Clock, FileText, User, Wrench } from "lucide-react";
// import { useAuth } from "@/components/AuthProvider/AuthProvider";
// import { useRouter } from "next/navigation";

// const NotificationSystem = () => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // Buscar notificações do usuário
//   const fetchNotifications = async () => {
//     if (!user?.id) return;
    
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/notificacoes/${user.id}`);
//       if (response.ok) {
//         const data = await response.json();
//         setNotifications(data);
//         setUnreadCount(data.filter(n => !n.lida).length);
//       }
//     } catch (error) {
//       console.error('Erro ao buscar notificações:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Buscar contador de notificações não lidas
//   const fetchUnreadCount = async () => {
//     if (!user?.id) return;
    
//     try {
//       const response = await fetch(`/api/notificacoes/${user.id}/nao-lidas`);
//       if (response.ok) {
//         const data = await response.json();
//         setUnreadCount(data.count);
//       }
//     } catch (error) {
//       console.error('Erro ao buscar contador:', error);
//     }
//   };

//   useEffect(() => {
//     if (user?.id) {
//       fetchNotifications();
//       fetchUnreadCount();
//     }
//   }, [user]);

//   const getNotificationIcon = (type, status) => {
//     switch (type) {
//       case "chamado":
//         return <FileText className="h-4 w-4" />;
//       case "apontamento":
//         return <Wrench className="h-4 w-4" />;
//       case "status":
//         return <User className="h-4 w-4" />;
//       default:
//         return <Info className="h-4 w-4" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pendente":
//         return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
//       case "em andamento":
//         return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
//       case "concluido":
//         return "text-green-600 bg-green-100 dark:bg-green-900/20";
//       case "cancelado":
//         return "text-red-600 bg-red-100 dark:bg-red-900/20";
//       default:
//         return "text-gray-600 bg-gray-100 dark:bg-gray-700";
//     }
//   };

//   const formatTimeAgo = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
//     if (diffInMinutes < 1) return "Agora";
//     if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `${diffInHours}h atrás`;
    
//     const diffInDays = Math.floor(diffInHours / 24);
//     return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
//   };

//   const handleNotificationClick = async (notification) => {
//     try {
//       // Marcar como lida
//       const response = await fetch(`/api/notificacoes/${notification.id}/ler`, {
//         method: 'PUT'
//       });
      
//       if (response.ok) {
//         setNotifications(prev => 
//           prev.map(n => 
//             n.id === notification.id ? { ...n, lida: true } : n
//           )
//         );
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       }
//     } catch (error) {
//       console.error('Erro ao marcar notificação como lida:', error);
//     }
    
//     // Redirecionar baseado no tipo e dados
//     let redirectTo = null;
    
//     try {
//       const dados = notification.dados_adicional ? JSON.parse(notification.dados_adicional) : {};
      
//       switch (notification.tipo) {
//         case "chamado":
//           redirectTo = "/chamados-usuarios";
//           break;
//         case "apontamento":
//           redirectTo = "/admin/apontamentos";
//           break;
//         case "status":
//           redirectTo = "/meus-chamados";
//           break;
//         default:
//           redirectTo = "/";
//       }
//     } catch (error) {
//       console.error('Erro ao parsear dados da notificação:', error);
//       redirectTo = "/";
//     }
    
//     if (redirectTo) {
//       router.push(redirectTo);
//     }
    
//     setShowDropdown(false);
//   };

//   const markAllAsRead = async () => {
//     if (!user?.id) return;
    
//     try {
//       const response = await fetch(`/api/notificacoes/${user.id}/ler-todas`, {
//         method: 'PUT'
//       });
      
//       if (response.ok) {
//         setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
//         setUnreadCount(0);
//       }
//     } catch (error) {
//       console.error('Erro ao marcar todas como lidas:', error);
//     }
//   };

//   const removeNotification = async (id) => {
//     try {
//       const response = await fetch(`/api/notificacoes/${id}`, {
//         method: 'DELETE'
//       });
      
//       if (response.ok) {
//         const notification = notifications.find(n => n.id === id);
//         setNotifications(prev => prev.filter(n => n.id !== id));
        
//         if (notification && !notification.lida) {
//           setUnreadCount(prev => Math.max(0, prev - 1));
//         }
//       }
//     } catch (error) {
//       console.error('Erro ao deletar notificação:', error);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="relative">
//       {/* Botão de notificações */}
//       <button
//         onClick={() => setShowDropdown(!showDropdown)}
//         className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//         title="Notificações"
//       >
//         <Bell className="h-5 w-5" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Dropdown de notificações */}
//       {showDropdown && (
//         <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
//           {/* Header */}
//           <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//             <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notificações</h3>
//             <div className="flex gap-2">
//               {unreadCount > 0 && (
//                 <button
//                   onClick={markAllAsRead}
//                   className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
//                 >
//                   Marcar todas como lidas
//                 </button>
//               )}
//               <button
//                 onClick={() => setShowDropdown(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           {/* Lista de notificações */}
//           <div className="max-h-80 overflow-y-auto">
//             {loading ? (
//               <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="mt-2">Carregando...</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//                 <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                 <p>Nenhuma notificação</p>
//               </div>
//             ) : (
//               notifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
//                     !notification.lida ? 'bg-blue-50 dark:bg-blue-900/10' : ''
//                   }`}
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className={`p-2 rounded-full ${getStatusColor(notification.tipo)}`}>
//                       {getNotificationIcon(notification.tipo, notification.tipo)}
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
//                         {notification.titulo}
//                       </h4>
//                       <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 line-clamp-2">
//                         {notification.mensagem}
//                       </p>
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs text-gray-500 dark:text-gray-400">
//                           {formatTimeAgo(notification.criado_em)}
//                         </span>
//                         {!notification.lida && (
//                           <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                         )}
//                       </div>
//                     </div>
                    
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeNotification(notification.id);
//                       }}
//                       className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Footer */}
//           {notifications.length > 0 && (
//             <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
//               <button
//                 onClick={() => router.push("/notificacoes")}
//                 className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
//               >
//                 Ver todas as notificações
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Overlay para fechar ao clicar fora */}
//       {showDropdown && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => setShowDropdown(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default NotificationSystem;
