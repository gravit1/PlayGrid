import api from './api';

export const purchaseGame = async (gameId) => {
  const response = await api.post('/library/purchase', { gameId });
  return response.data;
};

export const getLibrary = async () => {
  const response = await api.get('/library');
  return response.data;
};

export const getLibraryGame = async (gameId) => {
  const response = await api.get(`/library/game/${gameId}`);
  return response.data;
};

export const getPurchaseHistory = async () => {
  const response = await api.get('/library/history');
  return response.data;
};
