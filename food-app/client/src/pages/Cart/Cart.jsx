import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CartItem from '../../components/UI/CartItem.jsx';
import LoadingSpinner from '../../components/UI/LoadingSpinner.jsx';
import useCart from '../../hooks/useCart.js';
import useAuth from '../../hooks/useAuth.js';
import { formatCurrency } from '../../utils/helpers.js';
import { placeOrderApi } from '../../api/orderApi.js';

function Cart() {
  const navigate = useNavigate();
  const { cart, loading, fetchCart, updateItem, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const defaultAddress = user?.addresses?.find((address) => address.isDefault) || user?.addresses?.[0];
  const [address, setAddress] = useState(
    defaultAddress || { line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', contactNumber: '' }
  );

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const hasItems = useMemo(() => (cart?.items?.length || 0) > 0, [cart]);

  const handleUpdate = async (itemId, quantity) => {
    await updateItem(itemId, { quantity });
  };

  const handleCheckout = async () => {
    if (!hasItems) return;
    const response = await placeOrderApi({ address, paymentMethod: 'cod' });
    toast.success(response.message);
    await fetchCart();
    navigate(`/orders/${response.data._id}`);
  };

  if (loading && !cart) {
    return <LoadingSpinner className="py-16" />;
  }

  return (
    <section className="container-app py-12">
      <h1 className="text-4xl font-black">Your cart</h1>
      {!hasItems ? (
        <div className="mt-8 card p-10 text-center">Your cart is empty. Add delicious items from a restaurant.</div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item._id} item={item} onUpdate={handleUpdate} onRemove={removeItem} />
            ))}
            <button type="button" className="btn-secondary" onClick={clearCart}>Clear cart</button>
          </div>
          <div className="card h-fit p-6">
            <h2 className="text-2xl font-black">Delivery details</h2>
            <div className="mt-5 space-y-4">
              <input className="input" placeholder="Address line 1" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
              <input className="input" placeholder="Address line 2" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <input className="input" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" placeholder="Postal code" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
                <input className="input" placeholder="Contact number" value={address.contactNumber} onChange={(e) => setAddress({ ...address, contactNumber: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <div className="flex items-center justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(cart.subtotal)}</span></div>
              <div className="flex items-center justify-between text-sm"><span>Delivery fee</span><span>{formatCurrency(cart.deliveryFee)}</span></div>
              <div className="flex items-center justify-between text-sm"><span>Tax</span><span>{formatCurrency(cart.tax)}</span></div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold dark:border-slate-700"><span>Total</span><span>{formatCurrency(cart.total)}</span></div>
            </div>
            <button type="button" onClick={handleCheckout} className="btn-primary mt-6 w-full">Place order</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
