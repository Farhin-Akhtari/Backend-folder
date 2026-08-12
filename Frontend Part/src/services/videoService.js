import api from "./axios";

export const getAllVideos = async (query = "", userId = "") => {
  const response = await api.get("/videos", {
    params: {
      query,
      userId,
    },
  });

  return response.data.data;
};

export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data;
};

export const publishVideo = async (formData) => {
  const response = await api.post("/videos", formData);
  return response.data;
};

export const updateVideo = async (videoId, formData) => {
  const response = await api.patch(`/videos/${videoId}`, formData);
  return response.data;
};

export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};