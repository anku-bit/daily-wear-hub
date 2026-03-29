import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState({ products: [] });
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart({ items: [] });
      setWishlist({ products: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.get();
      setCart(res.data.cart);
    } catch {}
  };

  const fetchWishlist = async () => {
    try {
      const res = await wishlistAPI.get();
      setWishlist(res.data.wishlist);
    } catch {}
  };

  const addToCart = async (productId, quantity = 1, size, color) => {
    if (!user) { toast.error('Please login to add to cart'); return; }
    setCartLoading(true);
    try {
      const res = await cartAPI.add({ productId, quantity, size, color });
      setCart(res.data.cart);
      toast.success('Added to cart!');
      setCartOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const updateCart = async (itemId, quantity) => {
    try {
      const res = await cartAPI.update({ itemId, quantity });
      setCart(res.data.cart);
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await cartAPI.remove(itemId);
      setCart(res.data.cart);
      toast.success('Removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [] });
    } catch {}
  };

  const toggleWishlist = async (productId) => {
    if (!user) { toast.error('Please login to use wishlist'); return; }
    try {
      const res = await wishlistAPI.toggle(productId);
      setWishlist(res.data.wishlist);
      toast.success(res.data.added ? '❤️ Added to wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) =>
    wishlist.products?.some(p => (p._id || p) === productId);

  const cartCount = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, wishlist, cartOpen, setCartOpen, cartLoading,
      addToCart, updateCart, removeFromCart, clearCart,
      toggleWishlist, isInWishlist, cartCount, cartTotal,
      fetchCart, fetchWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
