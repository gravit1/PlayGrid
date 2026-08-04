import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Game, Review } from '../../types';
import { getGameById } from '../../services/games';
import { getImageUrl } from '../../services/api';
import { purchaseGame, getLibraryGame } from '../../services/library';
import { checkWishlist, addToWishlist, removeFromWishlist } from '../../services/wishlist';
import { getReviewsByGame, getAverageRating, addReview } from '../../services/reviews';
import { Button } from '../../components/ui/Button';
import { Star, Heart, HeartOff, ShoppingCart } from 'lucide-react';

export const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { cartItems, addToCart } = useCart();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const gameData = await getGameById(id);
        setGame(gameData);

        const reviewsData = await getReviewsByGame(id);
        setReviews(reviewsData);

        const ratingData = await getAverageRating(id);
        setAvgRating(ratingData);

        if (user && user.role !== 'ROLE_ADMIN') {
          try {
            const wishlistStatus = await checkWishlist(id);
            setIsWishlisted(wishlistStatus);
          } catch (e) {
            // Might not be wishlisted or other error, ignore
          }
          try {
            await getLibraryGame(id);
            setIsOwned(true);
          } catch (e) {
            // Not owned
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (game) {
      addToCart(game);
      alert('Game added to cart!');
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActionLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(game!.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(game!.id);
        setIsWishlisted(true);
      }
    } catch (err) {
      alert('Wishlist action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    
    setSubmittingReview(true);
    try {
      const newReview = await addReview(game!.id, reviewRating, reviewComment, user?.username);
      setReviews([...reviews, newReview]);
      setReviewComment('');
      
      // Update average
      const ratingData = await getAverageRating(game!.id.toString());
      setAvgRating(ratingData);
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading game...</div>;
  if (!game) return <div className="text-center py-20 text-red-500">Game not found.</div>;

  const discountedPrice = game.discount > 0 
    ? game.price - (game.price * (game.discount / 100)) 
    : game.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-steam-text-light">{game.title}</h1>
        <div className="flex items-center space-x-4 mt-2 text-sm text-steam-text">
          <span>Release Date: {new Date(game.releaseDate).toLocaleDateString()}</span>
          <span>|</span>
          <span>Developer: {game.developer}</span>
          <span>|</span>
          <span>Publisher: {game.publisher}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="aspect-video bg-black overflow-hidden rounded-lg shadow-lg">
            <img 
              src={getImageUrl(game.thumbnailUrl)} 
              alt={game.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/1200x675/2a475e/c7d5e0?text=No+Image';
              }}
            />
          </div>
          
          <div className="mt-8 bg-steam-panel p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-steam-text-light uppercase tracking-wider mb-4 border-b border-steam-dark pb-2">About This Game</h2>
            <p className="whitespace-pre-wrap text-steam-text leading-relaxed">{game.description}</p>
          </div>
        </div>

        <div className="lg:w-1/3 space-y-6">
          <div className="bg-steam-panel p-6 rounded-lg shadow flex flex-col items-center">
            {game.discount > 0 && (
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-green-500 text-white font-bold px-2 py-1 text-sm rounded">-{game.discount}%</span>
                <span className="text-steam-text line-through">${game.price.toFixed(2)}</span>
              </div>
            )}
            <div className="text-4xl font-bold text-steam-text-light mb-6">
              ${discountedPrice.toFixed(2)}
            </div>
            
            {user?.role !== 'ROLE_ADMIN' && (
              <div className="w-full space-y-3">
                {isOwned ? (
                  <Button className="w-full py-3 text-lg flex items-center justify-center gap-2 bg-steam-panel text-steam-text-light border border-steam-accent cursor-default hover:bg-steam-panel">
                    <ShoppingCart size={20} /> In Library
                  </Button>
                ) : cartItems.some(item => item.id === game.id) ? (
                  <Button className="w-full py-3 text-lg flex items-center justify-center gap-2 bg-steam-panel text-steam-text-light border border-steam-accent cursor-default hover:bg-steam-panel">
                    <ShoppingCart size={20} /> In Cart
                  </Button>
                ) : (
                  <Button className="w-full py-3 text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#75b022] to-[#588a1b] hover:from-[#8ed629] hover:to-[#6aa621] text-white border-none" onClick={handlePurchase} isLoading={actionLoading}>
                    <ShoppingCart size={20} /> Add to Cart
                  </Button>
                )}
                
                <Button 
                  variant="secondary" 
                  className="w-full py-2 flex items-center justify-center gap-2" 
                  onClick={toggleWishlist}
                  isLoading={actionLoading}
                >
                  {isWishlisted ? <><HeartOff size={18} /> Remove from Wishlist</> : <><Heart size={18} /> Add to Wishlist</>}
                </Button>
              </div>
            )}
            {user?.role === 'ROLE_ADMIN' && (
              <div className="w-full mt-4 p-3 bg-steam-dark text-center rounded border border-steam-accent text-steam-accent text-sm">
                You are viewing this as an admin. Purchase disabled.
              </div>
            )}
          </div>

          <div className="bg-steam-panel p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-steam-text-light mb-2">Game Details</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-steam-text">Genre:</div>
              <div className="text-steam-accent text-right">{game.category}</div>
              
              <div className="text-steam-text">Reviews:</div>
              <div className="text-right flex items-center justify-end gap-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-steam-text-light">{avgRating.averageRating.toFixed(1)}</span>
                <span className="text-steam-text">({avgRating.totalReviews})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-steam-text-light uppercase tracking-wider mb-6 border-b border-steam-panel pb-2">Customer Reviews</h2>
        
        {user && user.role !== 'ROLE_ADMIN' && (
          <div className="bg-steam-panel p-6 rounded-lg shadow mb-8">
            <h3 className="font-bold text-steam-text-light mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-steam-text mb-2">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewRating(num)}
                      className={`p-2 rounded ${reviewRating >= num ? 'text-yellow-400' : 'text-steam-text'}`}
                    >
                      <Star size={24} className={reviewRating >= num ? 'fill-current' : ''} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <textarea
                  className="w-full bg-steam-dark border border-steam-bg rounded p-3 text-steam-text-light focus:outline-none focus:border-steam-accent min-h-[100px]"
                  placeholder="What do you think about this game?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <Button type="submit" isLoading={submittingReview}>Post Review</Button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-steam-text italic">No reviews yet.</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="bg-steam-panel p-4 rounded shadow border-l-4 border-steam-accent">
                <div className="flex justify-between items-start mb-3 border-b border-steam-dark pb-3">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.username || review.userId}`} alt="Avatar" className="w-10 h-10 rounded-full bg-steam-dark" />
                    <div>
                      <div className="font-bold text-steam-text-light">{review.username || `User ${review.userId}`}</div>
                      <div className="flex gap-1 text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'fill-current' : 'text-steam-dark'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-steam-text">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-steam-text-light whitespace-pre-wrap">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
