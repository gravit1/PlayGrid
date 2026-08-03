import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../../services/wishlist';
import { WishlistItem } from '../../types';
import { getImageUrl } from '../../services/api';
import { Button } from '../../components/ui/Button';

export const Wishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (gameId: number) => {
    try {
      await removeFromWishlist(gameId);
      setItems(items.filter(item => item.gameId !== gameId));
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  if (loading) return <div className="text-center py-20">Loading wishlist...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-steam-text-light uppercase tracking-wider mb-2">My Wishlist</h1>
        <div className="h-1 w-20 bg-steam-accent"></div>
      </div>

      {items.length === 0 ? (
        <div className="bg-steam-panel p-8 text-center rounded-lg shadow border border-steam-dark">
          <p className="text-steam-text text-lg">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-steam-panel p-4 rounded-lg shadow flex flex-col sm:flex-row gap-4 border border-steam-dark hover:border-steam-accent transition-colors">
              <Link to={`/games/${item.gameId}`} className="w-full sm:w-48 h-28 flex-shrink-0">
                <img 
                  src={getImageUrl(item.thumbnailUrl)} 
                  alt={item.title} 
                  className="w-full h-full object-cover rounded"
                />
              </Link>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <Link to={`/games/${item.gameId}`} className="text-xl font-bold text-steam-text-light hover:text-steam-accent transition-colors">
                    {item.title}
                  </Link>
                  <p className="text-sm text-steam-text mt-1">Category: {item.category} | Added: {new Date(item.addedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between items-end mt-4 sm:mt-0">
                  <div className="text-xl font-bold text-steam-text-light">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="text-sm py-1 px-3" onClick={() => handleRemove(item.gameId)}>Remove</Button>
                    <Link to={`/games/${item.gameId}`}>
                      <Button className="text-sm py-1 px-3">View Store Page</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
