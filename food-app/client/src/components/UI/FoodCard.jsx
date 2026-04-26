import { PlusIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/helpers.js';

function FoodCard({ item, onAdd, loading }) {
  return (
    <div className="card flex flex-col justify-between p-5">
      <div className="flex items-start gap-4">
        <img
          src={item.image?.url || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'}
          alt={item.name}
          className="h-24 w-24 rounded-2xl object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isVeg ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{formatCurrency(item.price)}</p>
              <p className="text-xs uppercase tracking-wide text-slate-400">{item.spiceLevel}</p>
            </div>
            <button type="button" onClick={() => onAdd(item)} disabled={loading || !item.isAvailable} className="btn-primary !rounded-full !px-4 !py-2">
              <PlusIcon className="mr-1 h-4 w-4" /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
