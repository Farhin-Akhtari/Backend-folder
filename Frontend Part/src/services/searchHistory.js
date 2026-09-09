import api from "./axios"

// Add Search History
export const addSearchHistory = async (query) => {
    const response = await api.post("/search-history", {
        query,
    });
    return response.data;
};

// Get Search History
export const getSearchHistory = async () => {
  const response = await api.get("/search-history");
  return response.data;
};

// Delete One Search History
export const deleteSearchHistory = async (searchHistoryId) => {
  const response = await api.delete(`/search-history/${searchHistoryId}`);
  return response.data;
};

// Clear All Search History
export const clearSearchHistory = async () => {
  const response = await api.delete("/search-history");
  return response.data;
};
