import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminRestaurantsApi, reviewRestaurantApi } from '../../api/orderApi.js';
import LoadingSpinner from '../../components/UI/LoadingSpinner.jsx';

function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRestaurants = async () => {
    try {
      const response = await getAdminRestaurantsApi();
      setRestaurants(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleReview = async (id, approvalStatus, isActive = true) => {
    const response = await reviewRestaurantApi(id, { approvalStatus, isActive });
    toast.success(response.message);
    loadRestaurants();
  };

  if (loading) {
    return <LoadingSpinner className="py-16" />;
  }

  return (
    <section className="container-app py-12">
      <h1 className="text-4xl font-black">Manage restaurants</h1>
      <div className="mt-8 grid gap-4">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="card flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">{restaurant.name}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{restaurant.description}</p>
              <p className="mt-2 text-sm font-semibold text-primary">Status: {restaurant.approvalStatus}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-secondary" onClick={() => handleReview(restaurant._id, 'approved', true)}>Approve</button>
              <button type="button" className="btn-secondary !border-amber-300 !text-amber-600" onClick={() => handleReview(restaurant._id, 'pending', true)}>Mark pending</button>
              <button type="button" className="btn-secondary !border-rose-300 !text-rose-600" onClick={() => handleReview(restaurant._id, 'blocked', false)}>Block</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ManageRestaurants;
