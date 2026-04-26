import api from './axios.js';

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const requestOtpLogin = async (payload) => {
  const { data } = await api.post('/auth/login/request-otp', payload);
  return data;
};

export const verifyUserOtp = async (payload) => {
  const { data } = await api.post('/auth/verify-otp', payload);
  return data;
};

export const resendUserOtp = async (payload) => {
  const { data } = await api.post('/auth/resend-otp', payload);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const updateUserProfile = async (payload) => {
  const { data } = await api.put('/auth/profile', payload);
  return data;
};
