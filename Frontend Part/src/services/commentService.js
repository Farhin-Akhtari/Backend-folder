import api from "./axios";

export const getVideoComments = async (videoId) => {
  const response = await api.get(`/comments/${videoId}`);
  return response.data;
};

export const createComment = async (videoId, content) => {
  const response = await api.post(`/comments/${videoId}`, {
    content,
  });

  return response.data;
};

// Edit comment
export const updateComment = async (commentId, content) => {
  const response = await api.patch(`/comments/c/${commentId}`, {
    content,
  });

  return response.data;
};

// Delete comment
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/c/${commentId}`);

  return response.data;
};