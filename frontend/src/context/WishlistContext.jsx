import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService.js';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wishlistService.getWishlist();
      const items = response.data?.wishlist?.items || [];
      setWishlist(items);
    } catch (error) {
      // Don't set error for 401 (unauthenticated) - user might not be logged in
      if (error.response?.status !== 401) {
        console.error('Error fetching wishlist:', error);
        setError(error.message);
      }
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch wishlist if user is authenticated
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, []);

  const isWishlisted = (productId) => {
    return wishlist.some(item => {
      const itemProductId = typeof item.product === 'object' ? item.product._id : item.product;
      return itemProductId === productId || itemProductId.toString() === productId.toString();
    });
  };

  const addToWishlist = async (productId) => {
    try {
      await wishlistService.addToWishlist(productId);
      await fetchWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      await fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const value = {
    wishlist,
    loading,
    error,
    fetchWishlist,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
