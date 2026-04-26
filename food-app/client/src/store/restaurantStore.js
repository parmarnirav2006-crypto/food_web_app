import { create } from 'zustand';
import toast from 'react-hot-toast';
import { getRestaurants, getRestaurantByIdentifier } from '../api/restaurantApi.js';

export const useRestaurantStore = create((set, get) => ({
  restaurants: [],
  selectedRestaurant: null,
  menu: [],
  filters: {
    page: 1,
    limit: 10,
    search: '',
    cuisines: '',
    minRating: '',
    priceLevel: '',
    sortBy: 'rating',
    order: 'desc'
  },
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  },
  loading: false,
  setFilters: (nextFilters) => set({ filters: { ...get().filters, ...nextFilters } }),
  fetchRestaurants: async (override = {}) => {
    set({ loading: true });
    try {
      const params = { ...get().filters, ...override };
      const response = await getRestaurants(params);
      set({
        restaurants: response.data,
        pagination: response.pagination,
        filters: params
      });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load restaurants');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  fetchRestaurantByIdentifier: async (identifier) => {
    set({ loading: true });
    try {
      const response = await getRestaurantByIdentifier(identifier);
      set({ selectedRestaurant: response.data.restaurant, menu: response.data.menu });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load restaurant');
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));
