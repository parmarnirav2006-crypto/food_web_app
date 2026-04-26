import { useEffect } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import RestaurantCard from '../../components/UI/RestaurantCard.jsx';
import LoadingSpinner from '../../components/UI/LoadingSpinner.jsx';
import useRestaurants from '../../hooks/useRestaurants.js';

function Home() {
  const { restaurants, loading, fetchRestaurants } = useRestaurants();

  useEffect(() => {
    fetchRestaurants({ page: 1, limit: 6, sortBy: 'rating', order: 'desc' });
  }, [fetchRestaurants]);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.25),_transparent_30%)]" />
        <div className="container-app relative grid gap-10 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">
              Swiggy/Zomato style full-stack food ordering template
            </span>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Discover restaurants you love and order in minutes.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              QuickBite combines secure email OTP login, persistent server-side carts, live order history, and a full admin dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/restaurants" className="btn-primary !rounded-2xl !px-6 !py-3 text-base">
                Explore restaurants <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/register" className="btn-secondary !rounded-2xl !border-white/15 !bg-white/10 !px-6 !py-3 !text-white">
                Create account
              </Link>
            </div>
          </div>
          <div className="relative mx-auto max-w-md animate-float rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
              alt="Food spread"
              className="h-96 w-full rounded-[1.5rem] object-cover"
            />
            <div className="absolute -bottom-4 left-4 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-soft">
              <p className="text-sm font-medium">Avg delivery time</p>
              <p className="text-2xl font-black text-primary">28 min</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Featured</p>
            <h2 className="mt-2 text-3xl font-black">Top rated restaurants</h2>
          </div>
          <Link to="/restaurants" className="text-sm font-semibold text-primary">View all</Link>
        </div>

        {loading ? (
          <LoadingSpinner className="py-20" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
