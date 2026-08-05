import React, { useEffect, useState } from 'react';
import { getLibrary } from '../../services/library';
import { LibraryItem, Game } from '../../types';
import { getGameById } from '../../services/games';
import { GameCard } from '../../components/game/GameCard';

export const Library = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const libraryItems: LibraryItem[] = await getLibrary();
        
        // Fetch full game details for each library item
        // In a real app with optimization, the backend would return joined data
        const gamePromises = libraryItems.map(item => getGameById(item.gameId.toString()));
        const gamesData = await Promise.all(gamePromises);
        
        setGames(gamesData);
      } catch (err) {
        console.error('Failed to fetch library', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  if (loading) return <div className="text-center py-20">Loading your library...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-steam-text-light uppercase tracking-wider mb-2">My Library</h1>
        <div className="h-1 w-20 bg-steam-accent"></div>
      </div>

      {games.length === 0 ? (
        <div className="bg-steam-panel p-8 text-center rounded-lg shadow border border-steam-dark">
          <p className="text-steam-text text-lg">Your library is empty.</p>
          <p className="text-sm mt-2 text-steam-text opacity-70">Games you purchase will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} isLibraryItem={true} />
          ))}
        </div>
      )}
    </div>
  );
};
