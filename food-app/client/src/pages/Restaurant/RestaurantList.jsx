import { useEffect } from 'react';
import RestaurantCard from '../../components/UI/RestaurantCard.jsx';
import SearchBar from '../../components/UI/SearchBar.jsx';
import Pagination from '../../components/UI/Pagination.jsx';
import LoadingSpinner from '../../components/UI/LoadingSpinner.jsx';
import useRestaurants from '../../hooks/useRestaurants.js';
import { CUISINE_OPTIONS, PRICE_LEVELS } from '../../utils/constants.js';

function RestaurantList() {
  const { restaurants, filters, pagination, loading, setFilters, fetchRestaurants } = useRestaurants();

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const updateFilters = (next) => {
    const payload = { ...filters, ...next, page: next.page || 1 };
    setFilters(payload);
    fetchRestaurants(payload);
  };

  return (
    <section className="container-app py-12">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black">Browse restaurants</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Search, filter, sort and paginate through live restaurant data.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-4 lg:min-w-[760px]">
          <SearchBar value={filters.search} onChange={(search) => updateFilters({ search })} />
          <select className="input" value={filters.cuisines} onChange={(e) => updateFilters({ cuisines: e.target.value })}>
            <option value="">All cuisines</option>
            {CUISINE_OPTIONS.map((cuisine) => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
          <select className="input" value={filters.priceLevel} onChange={(e) => updateFilters({ priceLevel: e.target.value })}>
            <option value="">All budgets</option>
            {PRICE_LEVELS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select className="input" value={filters.sortBy} onChange={(e) => updateFilters({ sortBy: e.target.value })}>
            <option value="rating">Sort by rating</option>
            <option value="deliveryTime">Sort by delivery time</option>
            <option value="priceLevel">Sort by price</option>
            <option value="name">Sort by name</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : restaurants.length ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} onChange={(page) => updateFilters({ page })} />
        </>
      ) : (
        <div className="card p-10 text-center">No restaurants found for your filters.</div>
      )}
    </section>
  );
}

export default RestaurantList;
