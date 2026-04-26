import { create } from 'zustand';
import toast from 'react-hot-toast';
import {
  registerUser,
  requestOtpLogin,
  verifyUserOtp,
  resendUserOtp,
  fetchCurrentUser,
  logoutUser,
  updateUserProfile
} from '../api/authApi.js';

const initialUser = JSON.parse(localStorage.getItem('food-app-user') || 'null');
const initialToken = localStorage.getItem('food-app-token');

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: initialToken,
  loading: false,
  pendingAuth: null,
  initialize: async () => {
    if (!get().token) return;
    set({ loading: true });
    try {
      const response = await fetchCurrentUser();
      set({ user: response.user });
      localStorage.setItem('food-app-user', JSON.stringify(response.user));
    } catch (_error) {
      localStorage.removeItem('food-app-user');
      localStorage.removeItem('food-app-token');
      set({ user: null, token: null });
    } finally {
      set({ loading: false });
    }
  },
  setPendingAuth: (payload) => set({ pendingAuth: payload }),
  register: async (payload) => {
    set({ loading: true });
    try {
      const response = await registerUser(payload);
      set({ pendingAuth: { email: response.email, purpose: 'register' } });
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  requestLoginOtp: async (payload) => {
    set({ loading: true });
    try {
      const response = await requestOtpLogin(payload);
      set({ pendingAuth: { email: response.email, purpose: 'login' } });
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send OTP');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  verifyOtp: async (payload) => {
    set({ loading: true });
    try {
      const response = await verifyUserOtp(payload);
      localStorage.setItem('food-app-token', response.accessToken);
      localStorage.setItem('food-app-user', JSON.stringify(response.user));
      set({ user: response.user, token: response.accessToken, pendingAuth: null });
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  resendOtp: async (payload) => {
    try {
      const response = await resendUserOtp(payload);
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
      throw error;
    }
  },
  logout: async () => {
    try {
      await logoutUser();
    } catch (_error) {
      // ignore server logout failures and clear local session
    } finally {
      localStorage.removeItem('food-app-token');
      localStorage.removeItem('food-app-user');
      set({ user: null, token: null, pendingAuth: null });
      toast.success('Logged out');
    }
  },
  updateProfile: async (payload) => {
    set({ loading: true });
    try {
      const response = await updateUserProfile(payload);
      localStorage.setItem('food-app-user', JSON.stringify(response.user));
      set({ user: response.user });
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));
