import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../../types';
import { getImageUrl } from '../../services/api';
import { Button } from '../ui/Button';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const discountedPrice = game.discount > 0 
    ? game.price - (game.price * (game.discount / 100)) 
    : game.price;

  return (
    <Link to={`/games/${game.id}`} className="group bg-steam-panel block overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-steam-accent/20">
      <div className="aspect-video overflow-hidden relative">
        <img 
          src={getImageUrl(game.thumbnailUrl)} 
          alt={game.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/2a475e/c7d5e0?text=No+Image';
          }}
        />
        {game.discount > 0 && (
          <div className="absolute bottom-0 left-0 bg-green-500 text-white font-bold px-2 py-1 text-sm">
            -{game.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-steam-text-light font-medium text-lg truncate group-hover:text-steam-accent transition-colors">
          {game.title}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-2">
            <span className="text-xs bg-steam-dark px-2 py-1 rounded text-steam-text opacity-80">
              {game.category}
            </span>
          </div>
          <div className="text-right">
            {game.discount > 0 && (
              <span className="text-steam-text line-through text-xs mr-2">
                ${game.price.toFixed(2)}
              </span>
            )}
            <span className="text-steam-text-light font-semibold">
              ${discountedPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
