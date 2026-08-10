import api from "./axios";

export const getAllVideos = async () => {
    const response = await api.get("/videos");
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