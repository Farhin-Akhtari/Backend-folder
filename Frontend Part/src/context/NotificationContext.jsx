import { createContext, useEffect, useState } from "react";
import { getUserNotification, markNotificationAsRead } from "../services/notificationService.js";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getUserNotification();
        setNotifications(response.data || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
  try {
    await markNotificationAsRead(notificationId);

    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== notificationId)
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};