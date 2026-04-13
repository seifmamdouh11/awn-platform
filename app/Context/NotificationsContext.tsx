"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/app/utils/api";

export type Notification = {
  id: number;
  user_id: number;
  user_type: string;
  title: string;
  title_ar: string | null;
  title_en: string | null;
  message: string;
  message_ar: string | null;
  message_en: string | null;
  type: "info" | "success" | "warning" | "error" | "message" | "update";
  is_read: boolean;
  created_at: string;
};

type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      // Check if logged in before fetching
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/notifications");
      const fetchedNotifications = Array.isArray(response.data) ? response.data : [];
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};
