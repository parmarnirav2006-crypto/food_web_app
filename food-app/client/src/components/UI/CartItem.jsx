import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/helpers.js';

function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <img
          src={item.imageSnapshot || item.foodItem?.image?.url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop'}
          alt={item.nameSnapshot}
          className="h-20 w-20 rounded-2xl object-cover"
        />
        <div>
          <h3 className="font-semibold">{item.nameSnapshot}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatCurrency(item.priceSnapshot)} each</p>
          <p className="mt-1 text-sm font-semibold text-primary">{formatCurrency(item.quantity * item.priceSnapshot)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1 dark:border-slate-700">
          <button type="button" onClick={() => onUpdate(item._id, Math.max(0, item.quantity - 1))} className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
          <button type="button" onClick={() => onUpdate(item._id, item.quantity + 1)} className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <button type="button" onClick={() => onRemove(item._id)} className="rounded-full p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
