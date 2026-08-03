import React, { useState, useEffect } from 'react';
import { Game } from '../../types';
import { createGame, updateGame } from '../../services/games';
import { Button } from '../../components/ui/Button';

interface GameFormProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game | null;
  onSave: () => void;
}

export const GameForm: React.FC<GameFormProps> = ({ isOpen, onClose, game, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [category, setCategory] = useState('');
  const [developer, setDeveloper] = useState('');
  const [publisher, setPublisher] = useState('');
  
  const [isUrlMode, setIsUrlMode] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (game) {
      setTitle(game.title);
      setDescription(game.description);
      setPrice(game.price.toString());
      setDiscount(game.discount?.toString() || '0');
      setReleaseDate(game.releaseDate || '');
      setCategory(game.category);
      setDeveloper(game.developer);
      setPublisher(game.publisher);
      setActive(game.active);
      setThumbnailUrl(game.thumbnailUrl || '');
      setIsUrlMode(true);
    } else {
      resetForm();
    }
  }, [game, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setDiscount('');
    setReleaseDate('');
    setCategory('');
    setDeveloper('');
    setPublisher('');
    setThumbnailUrl('');
    setThumbnailFile(null);
    setActive(true);
    setIsUrlMode(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('discount', discount || '0');
      formData.append('releaseDate', releaseDate);
      formData.append('category', category);
      formData.append('developer', developer);
      formData.append('publisher', publisher);
      
      if (game) {
        formData.append('active', active ? 'true' : 'false');
      }

      if (isUrlMode && thumbnailUrl) {
        formData.append('thumbnailUrl', thumbnailUrl);
      } else if (!isUrlMode && thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else if (!game) {
        throw new Error("Thumbnail is required");
      }

      if (game) {
        await updateGame(game.id, formData);
      } else {
        await createGame(formData);
      }
      
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save game');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-steam-panel p-6 rounded-lg shadow-xl border border-steam-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-steam-text-light mb-6">
          {game ? 'Edit Game' : 'Add New Game'}
        </h2>
        
        {error && (
          <div className="bg-red-900 bg-opacity-50 text-red-200 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 text-steam-text">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-steam-bg border border-steam-dark rounded p-2 focus:border-steam-accent outline-none text-steam-text-light" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Category</label>
              <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-steam-bg border border-steam-dark rounded p-2 focus:border-steam-accent outline-none text-steam-text-light" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Description</label>
            <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-steam-bg border border-steam-dark rounded p-2 focus:border-steam-accent outline-none text-steam-text-light" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm">Price ($)</label>
              <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-steam-bg border border-steam-dark rounded p-2 focus:border-steam-accent outline-none text-steam-text-light" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Discount (%)</label>
              <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full bg-steam-bg border border-steam-dark rounded p-2 focus:border-steam-accent outline-none text-steam-text-light" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Release Date</label>
              <input type="date" required value={releaseDate} onChange={e => setReleaseDate(e.target.value)} className="w-full bg-steam-bg border border-steam-dark rounded p-2 focus:border-steam-accent outline-none text-steam-text-light" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Developer</label>
              <input type="text" required value={developer} onChange={e => setDeveloper(e.target.value)} className="w-full bg-steam-bg border border-steam-dark rounded p-2 focus:border-steam-accent outline-none text-steam-text-light" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Publisher</label>
              <input type="text" required value={publisher} onChange={e => setPublisher(e.target.value)} className="w-full bg-steam-bg border border-steam-dark rounded p-2 focus:border-steam-accent outline-none text-steam-text-light" />
            </div>
          </div>

          <div className="border border-steam-dark p-4 rounded bg-steam-dark">
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={isUrlMode} onChange={() => setIsUrlMode(true)} className="accent-steam-accent" />
                <span>Web Image URL</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!isUrlMode} onChange={() => setIsUrlMode(false)} className="accent-steam-accent" />
                <span>Upload File</span>
              </label>
            </div>
            
            {isUrlMode ? (
              <div>
                <input type="url" placeholder="https://example.com/image.jpg" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="w-full bg-steam-bg border border-steam-dark rounded p-2 focus:border-steam-accent outline-none text-steam-text-light" />
                {thumbnailUrl && <img src={thumbnailUrl} alt="Preview" className="mt-2 h-20 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }} />}
              </div>
            ) : (
              <div>
                <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} className="w-full text-sm text-steam-text file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-steam-accent file:text-white hover:file:bg-opacity-80" />
              </div>
            )}
          </div>

          {game && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={active} onChange={e => setActive(e.target.checked)} className="accent-steam-accent w-4 h-4" />
              <label htmlFor="active" className="cursor-pointer">Active Game</label>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-steam-dark">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Game'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
