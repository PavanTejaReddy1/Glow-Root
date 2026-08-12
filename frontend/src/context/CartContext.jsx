import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService.js';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await cartService.getCart();
      setCart(response.data?.cart || null);
    } catch (error) {
      // Don't set error for 401 (unauthenticated) - user might not be logged in
      if (error.response?.status !== 401) {
        console.error('Error fetching cart:', error);
        setError(error.message);
      }
      setCart(null);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Only fetch cart if user is authenticated
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity = 1, variant = null) => {
    try {
      await cartService.addItem(productId, quantity, variant);
      await fetchCart(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setUpdating(true);
    try {
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart(false);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setUpdating(true);
    try {
      await cartService.removeFromCart(itemId);
      await fetchCart(false);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    setUpdating(true);
    try {
      await cartService.clearCart();
      await fetchCart(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const cartCount = cart?.items?.length || 0;
  const cartTotal = cart?.total || 0;

  const value = {
    cart,
    loading,
    updating,
    error,
    cartCount,
    cartTotal,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
