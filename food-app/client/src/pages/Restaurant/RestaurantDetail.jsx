import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import FoodCard from '../../components/UI/FoodCard.jsx';
import LoadingSpinner from '../../components/UI/LoadingSpinner.jsx';
import useRestaurants from '../../hooks/useRestaurants.js';
import useCart from '../../hooks/useCart.js';

function RestaurantDetail() {
  const { identifier } = useParams();
  const { selectedRestaurant, menu, loading, fetchRestaurantByIdentifier } = useRestaurants();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchRestaurantByIdentifier(identifier);
  }, [fetchRestaurantByIdentifier, identifier]);

  const handleAdd = async (item) => {
    try {
      await addToCart({ foodItemId: item._id, quantity: 1 });
    } catch (_error) {
      toast.error('Unable to add item to cart');
    }
  };

  if (loading && !selectedRestaurant) {
    return <LoadingSpinner className="py-20" />;
  }

  if (!selectedRestaurant) {
    return <div className="container-app py-16"><div className="card p-10 text-center">Restaurant not found.</div></div>;
  }

  return (
    <section className="container-app py-12">
      <div className="card overflow-hidden">
        <img
          src={selectedRestaurant.coverImage?.url || selectedRestaurant.images?.[0]?.url || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1400&auto=format&fit=crop'}
          alt={selectedRestaurant.name}
          className="h-72 w-full object-cover"
        />
        <div className="space-y-4 p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-black">{selectedRestaurant.name}</h1>
              <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">{selectedRestaurant.description}</p>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">⭐ {selectedRestaurant.rating?.toFixed(1)} rating</div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">🕒 {selectedRestaurant.deliveryTime} min</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedRestaurant.cuisines?.map((cuisine) => (
              <span key={cuisine} className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {menu.map((item) => (
          <FoodCard key={item._id} item={item} onAdd={handleAdd} loading={loading} />
        ))}
      </div>
    </section>
  );
}

export default RestaurantDetail;
