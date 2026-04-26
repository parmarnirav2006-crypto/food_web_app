import { Fragment, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  ShoppingBagIcon,
  UserCircleIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth.js';
import { useCartStore } from '../../store/cartStore.js';

const baseLinks = [
  { name: 'Home', to: '/' },
  { name: 'Restaurants', to: '/restaurants' },
  { name: 'Orders', to: '/orders', auth: true }
];

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const cartItems = useCartStore((state) => state.cart?.items);
  const [open, setOpen] = useState(false);

  const links = useMemo(() => {
    const items = baseLinks.filter((item) => !item.auth || user);
    if (user?.role === 'admin') {
      items.push({ name: 'Admin', to: '/admin' });
    }
    return items;
  }, [user]);

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
          <span className="rounded-2xl bg-primary px-3 py-1 text-white">QB</span>
          QuickBite
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary dark:text-slate-300'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/cart" className="relative rounded-full border border-slate-200 p-2 dark:border-slate-700">
            <ShoppingBagIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold">
                <UserCircleIcon className="h-8 w-8 text-primary" />
                <span>{user.name}</span>
              </Link>
              <button type="button" onClick={handleLogout} className="btn-secondary !px-3 !py-2">
                <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </div>
          )}
        </div>

        <button type="button" className="rounded-xl border border-slate-200 p-2 md:hidden dark:border-slate-700" onClick={() => setOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/50" />
          </Transition.Child>

          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in duration-150"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="flex h-full w-80 flex-col bg-white p-6 dark:bg-slate-950">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-lg font-bold">Menu</span>
                  <button type="button" onClick={() => setOpen(false)}>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                  {links.map((link) => (
                    <NavLink key={link.to} to={link.to} className="rounded-xl px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => setOpen(false)}>
                      {link.name}
                    </NavLink>
                  ))}
                  <Link to="/cart" className="rounded-xl px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => setOpen(false)}>
                    Cart ({cartCount})
                  </Link>
                </div>
                {user ? (
                  <button type="button" onClick={handleLogout} className="btn-primary w-full">Logout</button>
                ) : (
                  <div className="grid gap-3">
                    <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary w-full">Login</Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">Sign up</Link>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </header>
  );
}

export default Navbar;