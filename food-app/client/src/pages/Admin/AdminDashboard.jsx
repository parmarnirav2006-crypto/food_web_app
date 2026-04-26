import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner.jsx';
import { getAdminDashboardApi, getAdminUsersApi } from '../../api/orderApi.js';
import { formatCurrency } from '../../utils/helpers.js';

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsResponse, usersResponse] = await Promise.all([getAdminDashboardApi(), getAdminUsersApi()]);
        setDashboard(statsResponse.data);
        setUsers(usersResponse.data);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner className="py-16" />;
  }

  return (
    <section className="container-app py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black">Admin dashboard</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Analytics overview for users, restaurants and orders.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/restaurants" className="btn-secondary">Manage restaurants</Link>
          <Link to="/admin/orders" className="btn-primary">Manage orders</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-6"><p className="text-sm text-slate-500">Users</p><p className="mt-2 text-4xl font-black">{dashboard.stats.usersCount}</p></div>
        <div className="card p-6"><p className="text-sm text-slate-500">Restaurants</p><p className="mt-2 text-4xl font-black">{dashboard.stats.restaurantsCount}</p></div>
        <div className="card p-6"><p className="text-sm text-slate-500">Orders</p><p className="mt-2 text-4xl font-black">{dashboard.stats.ordersCount}</p></div>
        <div className="card p-6"><p className="text-sm text-slate-500">Revenue</p><p className="mt-2 text-4xl font-black">{formatCurrency(dashboard.stats.revenue)}</p></div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <h2 className="text-2xl font-black">Latest orders</h2>
          <div className="mt-5 space-y-4">
            {dashboard.latestOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-semibold">{order.user?.name} → {order.restaurant?.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.status.replaceAll('_', ' ')}</p>
                </div>
                <span className="font-semibold">{formatCurrency(order.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-black">Newest users</h2>
          <div className="mt-5 space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="font-semibold">{user.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
