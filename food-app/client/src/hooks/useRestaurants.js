import { useRestaurantStore } from '../store/restaurantStore.js';

const useRestaurants = () => {
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const selectedRestaurant = useRestaurantStore((state) => state.selectedRestaurant);
  const menu = useRestaurantStore((state) => state.menu);
  const filters = useRestaurantStore((state) => state.filters);
  const pagination = useRestaurantStore((state) => state.pagination);
  const loading = useRestaurantStore((state) => state.loading);
  const setFilters = useRestaurantStore((state) => state.setFilters);
  const fetchRestaurants = useRestaurantStore((state) => state.fetchRestaurants);
  const fetchRestaurantByIdentifier = useRestaurantStore((state) => state.fetchRestaurantByIdentifier);

  return { restaurants, selectedRestaurant, menu, filters, pagination, loading, setFilters, fetchRestaurants, fetchRestaurantByIdentifier };
};

export default useRestaurants;
