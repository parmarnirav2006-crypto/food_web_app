import { Link } from 'react-router-dom';
import { ClockIcon, StarIcon } from '@heroicons/react/24/solid';
import { priceLevelToText } from '../../utils/helpers.js';

function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant.slug || restaurant._id}`} className="card group overflow-hidden transition hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={restaurant.coverImage?.url || restaurant.images?.[0]?.url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop'}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
          {restaurant.cuisines?.slice(0, 2).join(' • ')}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">{restaurant.name}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{restaurant.description}</p>
          </div>
          <span className="rounded-xl bg-secondary px-2.5 py-1 text-sm font-semibold text-white">{priceLevelToText(restaurant.priceLevel)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            {restaurant.rating?.toFixed(1)}
          </div>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-5 w-5 text-primary" />
            {restaurant.deliveryTime} min
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RestaurantCard;
