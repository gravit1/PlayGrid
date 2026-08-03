import api from './api';

export const getAllGames = async () => {
  const response = await api.get('/games');
  return response.data;
};

export const getGameById = async (id) => {
  const response = await api.get(`/games/${id}`);
  return response.data;
};

export const searchGames = async (keyword) => {
  const response = await api.get(`/games/search?keyword=${keyword}`);
  return response.data;
};

export const getGamesByCategory = async (category) => {
  const response = await api.get(`/games/category/${category}`);
  return response.data;
};

export const getGamesDetails = async (ids) => {
  const response = await api.post('/games/details', ids);
  return response.data;
};

// Admin endpoints
export const createGame = async (formData) => {
  const response = await api.post('/games', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateGame = async (id, formData) => {
  const response = await api.put(`/games/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteGame = async (id) => {
  const response = await api.delete(`/games/${id}`);
  return response.data;
};
