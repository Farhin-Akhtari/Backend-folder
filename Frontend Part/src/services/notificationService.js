import api from "./axios";

export const getUserNotification = async () => {
    const response = await api.get("/notifications");

    return response.data;
}

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(
    `/notifications/${notificationId}/read`);

  return response.data;
};