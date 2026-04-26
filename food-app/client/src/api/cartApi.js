import api from './axios.js';

export const getCartApi = async () => {
  const { data } = await api.get('/cart');
  return data;
};

export const addToCartApi = async (payload) => {
  const { data } = await api.post('/cart', payload);
  return data;
};

export const updateCartItemApi = async (itemId, payload) => {
  const { data } = await api.put(`/cart/${itemId}`, payload);
  return data;
};

export const removeCartItemApi = async (itemId) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data;
};

export const clearCartApi = async () => {
  const { data } = await api.delete('/cart');
  return data;
};
