import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner.jsx';
import { getOrderByIdApi } from '../../api/orderApi.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await getOrderByIdApi(id);
        setOrder(response.data);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner className="py-16" />;
  }

  if (!order) {
    return <div className="container-app py-16"><div className="card p-10 text-center">Order not found.</div></div>;
  }

  return (
    <section className="container-app py-12">
      <div className="card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Order #{order._id.slice(-6)}</p>
            <h1 className="mt-2 text-3xl font-black">{order.restaurant?.name}</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold capitalize dark:bg-slate-800">
            {order.status.replaceAll('_', ' ')}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.foodItem} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="font-semibold">Delivery address</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {order.address.line1}, {order.address.line2 ? `${order.address.line2}, ` : ''}
                {order.address.city}, {order.address.state} - {order.address.postalCode}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">
            <h2 className="text-xl font-black">Bill summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex items-center justify-between"><span>Delivery fee</span><span>{formatCurrency(order.deliveryFee)}</span></div>
              <div className="flex items-center justify-between"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold dark:border-slate-700"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;
