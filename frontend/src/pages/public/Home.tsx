import React, { useEffect, useState } from 'react';
import { Game } from '../../types';
import { getAllGames } from '../../services/games';
import { GameCard } from '../../components/game/GameCard';

export const Home = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getAllGames();
        setGames(data);
      } catch (err) {
        setError('Failed to load games. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div className="text-center py-20 text-steam-text text-xl">Loading store...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-steam-text-light uppercase tracking-wider mb-2">Featured & Recommended</h1>
        <div className="h-1 w-20 bg-steam-accent"></div>
      </div>
      
      {games.length === 0 ? (
        <div className="text-center py-10 text-steam-text">No games found in the store.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};
