export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
];

export const CUISINE_OPTIONS = [
  'North Indian',
  'South Indian',
  'Chinese',
  'Italian',
  'Biryani',
  'Desserts',
  'Fast Food',
  'Healthy'
];

export const PRICE_LEVELS = [
  { label: 'Budget', value: 1 },
  { label: 'Value+', value: 2 },
  { label: 'Premium', value: 3 },
  { label: 'Luxury', value: 4 }
];
