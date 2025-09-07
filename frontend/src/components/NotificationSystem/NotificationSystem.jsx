"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { apiRequest } from "@/lib/auth";

const NotificationSystem = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await apiRequest(`/api/notificacoes/${user.id}`);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.lida).length);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiRequest(`/api/notificacoes/${id}/ler`, { method: 'PUT' });
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold">Notificações</h3>
            <button onClick={() => setShowDropdown(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b dark:border-gray-700 ${!notification.lida ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                >
                  <p className="font-medium text-sm">{notification.titulo}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{notification.mensagem}</p>
                  {!notification.lida && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:underline mt-2"
                    >
                      Marcar como lida
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-gray-500">Nenhuma notificação.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;