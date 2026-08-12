import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';
import { productService } from '../services/productService.js';
import { reviewService } from '../services/reviewService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { success, error: toastError } = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getProduct(slug);
      const found = response.data?.product || response.data;

      if (found) {
        setProduct(found);
        document.title = `${found.name} — GlowRoot`;

        if (found.category?._id) {
          const relatedResponse = await productService.getProducts({ category: found.category._id });
          const relatedProducts = relatedResponse.data?.products || [];
          setRelated(relatedProducts.filter(p => p._id !== found._id).slice(0, 4));
        }

        const reviewsResponse = await reviewService.getProductReviews(found._id);
        setReviews(reviewsResponse.data?.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toastError('Please login to add items to your bag');
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product._id, qty);
      setAdded(true);
      success(`${product.name} added to your bag!`);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to add to bag');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toastError('Please login to submit a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.createReview(product._id, reviewForm);
      success('Review submitted successfully!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      const reviewsResponse = await reviewService.getProductReviews(product._id);
      setReviews(reviewsResponse.data?.reviews || []);
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 md:py-24" style={{ backgroundColor: '#F8F2E8' }}>
        <div className="mx-auto max-w-content px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
            <div className="space-y-4">
              <div className="h-8 animate-pulse rounded bg-gray-200" />
              <div className="h-12 animate-pulse rounded bg-gray-200" />
              <div className="h-24 animate-pulse rounded bg-gray-200" />
              <div className="h-12 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <Navigate to="/shop" replace />;

  return (
    <div className="py-16 md:py-24" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4">
        {/* Breadcrumb */}
        <p
          className="mb-8 text-xs tracking-wider uppercase"
          style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
        >
          <Link to="/shop" className="transition-colors hover:opacity-80">Shop</Link>
          {' / '}
          <span>{product.category?.name || 'Products'}</span>
          {' / '}
          <span>{product.name}</span>
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Product Image */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-sm">
              <img
                src={product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <span
              className="mb-3 inline-block text-sm font-medium tracking-wider uppercase"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#C59B45' }}
            >
              {product.category?.name || 'Product'}
            </span>
            <h1
              className="mb-4 text-3xl font-medium md:text-4xl lg:text-5xl"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              {product.name}
            </h1>

            <div className="mb-6 flex items-center gap-2">
              <div className="flex gap-0.5" style={{ color: '#C59B45' }}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(product.averageRating || 0) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2Z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                {product.averageRating || 0} · {product.reviewCount || 0} reviews
              </span>
            </div>

            <div className="mb-8 border-b" style={{ borderColor: 'rgba(197,155,69,0.25)' }} />

            <p
              className="mb-8 text-base leading-relaxed"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              {product.shortDescription || product.description}
            </p>

            <div className="mb-4 flex items-center gap-3">
              <p
                className="text-3xl font-medium md:text-4xl"
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#C59B45' }}
              >
                ₹{product.price?.toLocaleString('en-IN') || 0}
              </p>
              {product.mrp && product.mrp > product.price && (
                <p
                  className="text-lg line-through"
                  style={{ fontFamily: '"Cormorant Garamond", serif', color: '#9CA3AF' }}
                >
                  ₹{product.mrp?.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <p className="mb-4 text-sm font-medium" style={{ color: '#F59E0B', fontFamily: '"Poppins", sans-serif' }}>
                Only {product.stock} left in stock — order soon
              </p>
            )}

            <div className="mb-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border" style={{ borderColor: 'rgba(197,155,69,0.35)' }}>
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-3 transition-colors hover:opacity-70"
                  style={{ color: '#6E4B2A' }}
                >
                  −
                </button>
                <span
                  className="w-10 text-center font-medium"
                  style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                >
                  {qty}
                </span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQty(q => Math.min(q + 1, product.stock || 99))}
                  className="px-4 py-3 transition-colors hover:opacity-70"
                  style={{ color: '#6E4B2A' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 rounded-full px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  backgroundColor: added ? '#5B7F3A' : '#6E4B2A',
                  color: '#F8F2E8',
                  transition: 'background-color 0.3s'
                }}
              >
                {addingToCart ? 'Adding...' : added ? '✓ Added to Bag' : product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>
            </div>

            <div className="space-y-4 rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#FCFAF6' }}>
              <Detail label="Free shipping" value="On orders above ₹1,999" />
              <Detail label="Formulation" value="Cold-processed, small batch" />
              <Detail label="Returns" value="14-day ritual guarantee" />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2
              className="mb-8 text-3xl font-medium md:text-4xl"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              You may also love
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="mt-24">
          <h2
            className="mb-8 text-3xl font-medium md:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Customer Reviews
          </h2>

          {/* Review Form */}
          <div className="mb-8 rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#FCFAF6' }}>
            <h3
              className="mb-4 text-xl font-medium"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              Write a Review
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className="text-2xl transition-transform hover:scale-110"
                      style={{ color: star <= reviewForm.rating ? '#C59B45' : '#D1D5DB' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.title}
                  onChange={e => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                  style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                  Comment
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                  style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="rounded-full px-8 py-3 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90 disabled:opacity-70"
                style={{ fontFamily: '"Poppins", sans-serif', backgroundColor: '#6E4B2A', color: '#F8F2E8' }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              reviews.map(review => (
                <div
                  key={review._id}
                  className="rounded-lg p-6 shadow-sm"
                  style={{ backgroundColor: '#FCFAF6' }}
                >
                  <div className="mb-2 flex items-center gap-4">
                    <div className="flex gap-0.5" style={{ color: '#C59B45' }}>
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill={i < review.rating ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-medium" style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}>
                      {review.title}
                    </span>
                  </div>
                  <p className="mb-2 text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                    {review.comment}
                  </p>
                  <p className="text-xs" style={{ fontFamily: '"Poppins", sans-serif', color: '#9CA3AF' }}>
                    By {review.user?.firstName || 'Anonymous'} · {new Date(review.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-3 last:border-0" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
      <span className="text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
        {label}
      </span>
      <span className="text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}>
        {value}
      </span>
    </div>
  );
}
