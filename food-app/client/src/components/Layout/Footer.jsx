import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-app grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold">QuickBite</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            A production-grade food ordering experience with secure OTP auth, live cart sync, and admin controls.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Explore</h4>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Link to="/restaurants">Restaurants</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">hello@quickbite.app</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Built with React, Zustand, Tailwind and Express.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
