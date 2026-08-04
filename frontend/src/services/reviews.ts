import api from './api';

export const addReview = async (gameId, rating, comment, username) => {
  const response = await api.post('/reviews', { gameId, rating, comment, username });
  return response.data;
};

export const updateReview = async (id, rating, comment) => {
  const response = await api.put(`/reviews/${id}`, { rating, comment });
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

export const getReviewsByGame = async (gameId) => {
  const response = await api.get(`/reviews/game/${gameId}`);
  return response.data;
};

export const getAverageRating = async (gameId) => {
  const response = await api.get(`/reviews/game/${gameId}/average`);
  return response.data;
};
