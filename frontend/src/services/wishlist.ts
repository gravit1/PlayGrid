import api from './api';

export const addToWishlist = async (gameId) => {
  const response = await api.post('/wishlist', { gameId });
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const checkWishlist = async (gameId) => {
  const response = await api.get(`/wishlist/game/${gameId}`);
  return response.data;
};

export const removeFromWishlist = async (gameId) => {
  const response = await api.delete(`/wishlist/game/${gameId}`);
  return response.data;
};
