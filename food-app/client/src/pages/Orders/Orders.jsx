import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner.jsx';
import { getOrdersApi } from '../../api/orderApi.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrdersApi();
        setOrders(response.data);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner className="py-16" />;
  }

  return (
    <section className="container-app py-12">
      <h1 className="text-4xl font-black">Your orders</h1>
      <div className="mt-8 grid gap-4">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">{order.status.replaceAll('_', ' ')}</p>
              <h3 className="mt-2 text-xl font-bold">{order.restaurant?.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.items.length} item(s)</p>
            </div>
          </Link>
        ))}
        {!orders.length && <div className="card p-10 text-center">You have not placed any orders yet.</div>}
      </div>
    </section>
  );
}

export default Orders;
