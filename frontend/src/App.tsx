import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute, AdminRoute } from './components/layout/RouteGuards';
import { CartProvider } from './context/CartContext';

// Public Pages
import { Home } from './pages/public/Home';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { GameDetails } from './pages/public/GameDetails';
import { SearchResults } from './pages/public/SearchResults';

// User Pages
import { Profile } from './pages/user/Profile';
import { Library } from './pages/user/Library';
import { Wishlist } from './pages/user/Wishlist';
import { Checkout } from './pages/user/Checkout';
import { OrderHistory } from './pages/user/OrderHistory';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-steam-bg font-sans text-steam-text">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/games/:id" element={<GameDetails />} />
                <Route path="/search" element={<SearchResults />} />
                
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/library" element={
                  <ProtectedRoute><Library /></ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute><Wishlist /></ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute><OrderHistory /></ProtectedRoute>
                } />

                <Route path="/admin/dashboard" element={
                  <AdminRoute><Dashboard /></AdminRoute>
                } />
              </Routes>
            </main>
            
            <footer className="bg-steam-dark py-8 border-t border-steam-panel mt-12">
              <div className="max-w-7xl mx-auto px-4 text-center text-sm text-steam-text">
                <p>&copy; 2026 PlayGrid Corporation. All rights reserved.</p>
                <p className="mt-2">All trademarks are property of their respective owners in the US and other countries.</p>
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
