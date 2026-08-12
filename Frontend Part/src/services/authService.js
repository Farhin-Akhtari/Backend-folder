import api from "./axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

export const getUserChannelProfile = async (username) => {
  const response = await api.get(`/users/c/${username}`);
  return response.data;
};