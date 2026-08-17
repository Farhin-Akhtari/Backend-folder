import api from "./axios";

export const createPlaylist = async (data) => {
  const response = await api.post("/playlists", data);
  return response.data;
};

export const getUserPlaylists = async (userId) => {
  const response = await api.get(`/playlists/user/${userId}`);
  return response.data;
};

export const getPlaylistById = async (playlistId) => {
  const response = await api.get(`/playlists/${playlistId}`);
  return response.data;
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
  const response = await api.post(
    `/playlists/${playlistId}/videos/${videoId}`
  );
  return response.data;
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  const response = await api.delete(
    `/playlists/${playlistId}/videos/${videoId}`
  );
  return response.data;
};

export const updatePlaylist = async (playlistId, data) => {
  const response = await api.patch(`/playlists/${playlistId}`, data);
  return response.data;
};

export const deletePlaylist = async (playlistId) => {
  const response = await api.delete(`/playlists/${playlistId}`);
  return response.data;
};