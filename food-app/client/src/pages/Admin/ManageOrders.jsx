import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminOrdersApi, updateAdminOrderStatusApi } from '../../api/orderApi.js';
import LoadingSpinner from '../../components/UI/LoadingSpinner.jsx';
import { ORDER_STATUSES } from '../../utils/constants.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const response = await getAdminOrdersApi();
      setOrders(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    const response = await updateAdminOrderStatusApi(id, { status });
    toast.success(response.message);
    loadOrders();
  };

  if (loading) {
    return <LoadingSpinner className="py-16" />;
  }

  return (
    <section className="container-app py-12">
      <h1 className="text-4xl font-black">Manage orders</h1>
      <div className="mt-8 grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">{formatDate(order.createdAt)}</p>
                <h2 className="mt-2 text-xl font-bold">{order.user?.name} · {order.restaurant?.name}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Total {formatCurrency(order.total)}</p>
              </div>
              <select className="input max-w-xs" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ManageOrders;
