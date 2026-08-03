import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Game } from '../../types';
import { searchGames } from '../../services/games';
import { GameCard } from '../../components/game/GameCard';

export const SearchResults = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        if (keyword) {
          const data = await searchGames(keyword);
          setGames(data);
        } else {
          setGames([]);
        }
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  if (loading) return <div className="text-center py-20 text-steam-text">Searching for "{keyword}"...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-steam-text-light uppercase tracking-wider mb-2">
          Search Results for "{keyword}"
        </h1>
        <div className="h-1 w-20 bg-steam-accent"></div>
      </div>
      
      {games.length === 0 ? (
        <div className="text-center py-10 text-steam-text">No games found matching your search.</div>
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
