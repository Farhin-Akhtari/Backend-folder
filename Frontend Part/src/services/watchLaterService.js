import api from "./axios";

export const toggleWatchLater = async (videoId) => {
  const response = await api.post(`/users/watch-later/${videoId}`);
  return response.data;
};

export const getWatchLater = async () => {
  const response = await api.get("/users/watch-later");
  return response.data;
};