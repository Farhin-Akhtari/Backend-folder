import api from "./axios";

export const getAllVideos = async () => {
    const response = await api.get("/videos");
    return response.data.data;
};