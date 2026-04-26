import api from './axios.js';

export const getRestaurants = async (params) => {
  const { data } = await api.get('/restaurants', { params });
  return data;
};

export const getRestaurantByIdentifier = async (identifier) => {
  const { data } = await api.get(`/restaurants/${identifier}`);
  return data;
};

export const createRestaurant = async (payload) => {
  const { data } = await api.post('/restaurants', payload);
  return data;
};

export const updateRestaurant = async (id, payload) => {
  const { data } = await api.put(`/restaurants/${id}`, payload);
  return data;
};

export const deleteRestaurant = async (id) => {
  const { data } = await api.delete(`/restaurants/${id}`);
  return data;
};
