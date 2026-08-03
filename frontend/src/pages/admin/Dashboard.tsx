import React, { useEffect, useState } from 'react';
import { Game } from '../../types';
import { getAllGames, deleteGame } from '../../services/games';
import { getImageUrl } from '../../services/api';
import { Button } from '../../components/ui/Button';

export const Dashboard = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await getAllGames();
      setGames(data);
    } catch (err) {
      console.error('Failed to fetch games', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    try {
      await deleteGame(id);
      setGames(games.filter(g => g.id !== id));
    } catch (err) {
      alert('Failed to delete game');
    }
  };

  if (loading) return <div className="text-center py-20 text-steam-text">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-steam-text-light uppercase tracking-wider mb-2">Admin Dashboard</h1>
          <div className="h-1 w-20 bg-steam-accent"></div>
        </div>
        <Button onClick={() => alert('Game form modal would open here to create new game')}>
          + Add New Game
        </Button>
      </div>

      <div className="bg-steam-panel rounded-lg shadow overflow-hidden border border-steam-dark">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-steam-dark text-steam-text-light border-b border-steam-panel">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steam-dark">
            {games.map(game => (
              <tr key={game.id} className="hover:bg-steam-bg transition-colors text-steam-text">
                <td className="p-4">{game.id}</td>
                <td className="p-4 font-medium text-steam-text-light flex items-center gap-3">
                  <img src={getImageUrl(game.thumbnailUrl)} alt={game.title} className="w-12 h-12 object-cover rounded" />
                  {game.title}
                </td>
                <td className="p-4">${game.price.toFixed(2)}</td>
                <td className="p-4">{game.category}</td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="secondary" className="px-3 py-1 text-sm inline-block">Edit</Button>
                  <Button variant="danger" className="px-3 py-1 text-sm inline-block" onClick={() => handleDelete(game.id)}>Delete</Button>
                </td>
              </tr>
            ))}
            {games.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center">No games found. Add some!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
