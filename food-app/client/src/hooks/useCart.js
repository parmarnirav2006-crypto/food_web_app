import { useCartStore } from '../store/cartStore.js';

const useCart = () => {
  const cart = useCartStore((state) => state.cart);
  const loading = useCartStore((state) => state.loading);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  return { cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart };
};

export default useCart;
