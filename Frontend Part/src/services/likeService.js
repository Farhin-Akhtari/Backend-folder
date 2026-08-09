import api from "./axios";

export const toggleVideoLike = async (videoId) => {
  const response = await api.post(`/likes/toggle/video/${videoId}`);
  return response.data;
};

export const toggleCommentLike = async (commentId) => {
  const response = await api.post(`/likes/toggle/comment/${commentId}`);
  return response.data;
};