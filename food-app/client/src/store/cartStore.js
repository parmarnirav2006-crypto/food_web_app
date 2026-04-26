import { create } from 'zustand';
import toast from 'react-hot-toast';
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi
} from '../api/cartApi.js';

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,
  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await getCartApi();
      set({ cart: response.data });
      return response.data;
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || 'Unable to load cart');
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  addToCart: async (payload) => {
    set({ loading: true });
    try {
      const response = await addToCartApi(payload);
      set({ cart: response.data });
      toast.success(response.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add item');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateItem: async (itemId, payload) => {
    const response = await updateCartItemApi(itemId, payload);
    set({ cart: response.data });
    return response.data;
  },
  removeItem: async (itemId) => {
    const response = await removeCartItemApi(itemId);
    set({ cart: response.data });
    toast.success(response.message);
    return response.data;
  },
  clearCart: async () => {
    const response = await clearCartApi();
    set({ cart: response.data });
    toast.success(response.message);
  }
}));
