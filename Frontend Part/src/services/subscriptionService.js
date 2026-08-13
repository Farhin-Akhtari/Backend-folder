import api from "./axios";

export const toggleSubscription = async (channelId) => {
  const response = await api.post(
    `/subscriptions/c/${channelId}`);
  return response.data;
};

export const getChannelSubscribers = async (channelId) => {
  const response = await api.get(`/subscriptions/c/${channelId}`);
  return response.data;
};

export const getChannelSubscriptions = async (channelId) => {
  const response = await api.get("/subscriptions", {
    params: {
      channelId,
    },
  });

  return response.data;
};

export const getSubscribedChannels = async () => {
  const response = await api.get("/subscriptions");
  return response.data;
};