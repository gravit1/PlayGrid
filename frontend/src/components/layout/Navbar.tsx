import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Gamepad2, Search, LogOut, Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <nav className="bg-steam-dark text-steam-text border-b border-steam-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-steam-text-light font-bold text-xl uppercase tracking-wider hover:text-steam-accent transition-colors">
              <Gamepad2 size={28} className="text-steam-accent" />
              PlayGrid
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link to="/" className="hover:text-steam-text-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Store</Link>
                {user && !isAdmin && (
                  <>
                    <Link to="/library" className="hover:text-steam-text-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Library</Link>
                    <Link to="/wishlist" className="hover:text-steam-text-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Wishlist</Link>
                    <Link to="/orders" className="hover:text-steam-text-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Orders</Link>
                  </>
                )}
                {isAdmin && (
                  <Link to="/admin/dashboard" className="hover:text-steam-text-light px-3 py-2 rounded-md text-sm font-medium text-steam-accent transition-colors">Dashboard</Link>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search store..."
                className="bg-steam-bg border border-steam-panel rounded-full py-1 px-4 pl-10 text-sm focus:outline-none focus:border-steam-accent text-steam-text-light w-48 transition-all focus:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1.5 text-steam-text" size={16} />
            </form>

            {user ? (
              <div className="flex items-center gap-4 ml-4 border-l border-steam-panel pl-4">
                {!isAdmin && (
                  <Link to="/checkout" className="relative text-steam-text hover:text-steam-text-light transition-colors mr-2" title="Cart">
                    <ShoppingCart size={20} />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-steam-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                )}
                <Link to="/profile" className="text-sm font-medium hover:text-steam-text-light truncate max-w-[100px]">
                  {user.username}
                </Link>
                <button onClick={handleLogout} className="text-steam-text hover:text-red-400 transition-colors" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-steam-panel pl-4">
                <Link to="/login" className="text-sm font-medium hover:text-steam-text-light">Login</Link>
                <Link to="/register">
                  <Button variant="primary" className="py-1 text-sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-steam-text hover:text-steam-text-light">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-steam-panel">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="mb-4 px-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-steam-dark border border-steam-bg rounded-md w-full py-2 px-4 pl-10 text-sm focus:outline-none focus:border-steam-accent text-steam-text-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-steam-text" size={16} />
              </div>
            </form>
            
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-steam-light hover:text-steam-text-light">Store</Link>
            
            {user && !isAdmin && (
              <>
                <Link to="/library" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-steam-light hover:text-steam-text-light">Library</Link>
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-steam-light hover:text-steam-text-light">Wishlist</Link>
                <Link to="/checkout" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-steam-light hover:text-steam-text-light">
                  Cart ({cartItems.length})
                </Link>
              </>
            )}
            
            {isAdmin && (
              <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-steam-accent hover:bg-steam-light hover:text-steam-text-light">Dashboard</Link>
            )}
            
            <div className="border-t border-steam-bg my-2"></div>
            
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-steam-light hover:text-steam-text-light">Profile ({user.username})</Link>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-steam-light hover:text-red-300">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-steam-light hover:text-steam-text-light">Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-steam-light hover:text-steam-text-light">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
