import api from './axios.js';

export const placeOrderApi = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data;
};

export const getOrdersApi = async () => {
  const { data } = await api.get('/orders');
  return data;
};

export const getOrderByIdApi = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const getAdminDashboardApi = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data;
};

export const getAdminOrdersApi = async () => {
  const { data } = await api.get('/admin/orders');
  return data;
};

export const updateAdminOrderStatusApi = async (id, payload) => {
  const { data } = await api.patch(`/admin/orders/${id}/status`, payload);
  return data;
};

export const getAdminRestaurantsApi = async () => {
  const { data } = await api.get('/admin/restaurants');
  return data;
};

export const reviewRestaurantApi = async (id, payload) => {
  const { data } = await api.patch(`/admin/restaurants/${id}/review`, payload);
  return data;
};

export const getAdminUsersApi = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};
