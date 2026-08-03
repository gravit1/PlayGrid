import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/order';
import { getImageUrl } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Trash2, CreditCard, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

export const Checkout = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.discount > 0 ? item.price - (item.price * (item.discount / 100)) : item.price;
    return sum + price;
  }, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setPaymentState('processing');
    
    try {
      const orderPayloadItems = cartItems.map(item => ({
        gameId: item.id,
        title: item.title,
        price: item.price,
        discount: item.discount || 0
      }));

      await createOrder(orderPayloadItems, 'CREDIT_CARD');
      
      // Simulate success animation state
      setPaymentState('success');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearCart();
      navigate('/orders');
    } catch (err: any) {
      setPaymentState('error');
      setErrorMessage(err.response?.data?.message || 'Payment failed. Please try again.');
      
      // Reset after a few seconds on error
      setTimeout(() => setPaymentState('idle'), 3000);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingCartIcon size={64} className="mx-auto text-steam-dark mb-6" />
        <h2 className="text-3xl font-bold text-steam-text-light mb-4">Your cart is empty</h2>
        <p className="text-steam-text mb-8">Looks like you haven't added any games to your cart yet.</p>
        <Link to="/">
          <Button variant="primary">Browse Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-steam-text mb-6">
        <Link to="/" className="hover:text-steam-text-light flex items-center gap-1">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-steam-text-light uppercase tracking-wider mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          <div className="bg-steam-panel p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-steam-text-light mb-4 border-b border-steam-dark pb-2">Your Items</h2>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 bg-steam-dark p-4 rounded-lg border border-steam-bg items-center">
                  <div className="w-32 h-18 bg-black rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={getImageUrl(item.thumbnailUrl)} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/120x67/2a475e/c7d5e0?text=No+Image';
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-steam-text-light">{item.title}</h3>
                    <p className="text-sm text-steam-text">{item.developer}</p>
                  </div>
                  
                  <div className="text-right flex flex-col justify-center items-end gap-2">
                    <div className="text-lg font-bold text-steam-text-light">
                      ${(item.discount > 0 ? item.price - (item.price * (item.discount / 100)) : item.price).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-steam-text hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-steam-panel p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-bold text-steam-text-light mb-4 border-b border-steam-dark pb-2">Order Summary</h2>
            
            <div className="flex justify-between items-center mb-2 text-steam-text">
              <span>Items ({cartItems.length}):</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-6 text-steam-text">
              <span>Tax:</span>
              <span>$0.00</span>
            </div>
            
            <div className="flex justify-between items-center mb-6 text-xl font-bold text-steam-text-light border-t border-steam-dark pt-4">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="relative">
              {/* Payment Overlay */}
              {paymentState !== 'idle' && (
                <div className="absolute inset-0 z-10 bg-steam-panel rounded-lg flex flex-col items-center justify-center -m-2">
                  {paymentState === 'processing' && (
                    <div className="flex flex-col items-center text-steam-accent animate-pulse">
                      <Loader2 size={48} className="animate-spin mb-4" />
                      <p className="font-bold">Processing Payment...</p>
                    </div>
                  )}
                  {paymentState === 'success' && (
                    <div className="flex flex-col items-center text-green-500 transform transition-all scale-110">
                      <CheckCircle2 size={56} className="mb-4" />
                      <p className="font-bold">Payment Successful!</p>
                      <p className="text-sm text-steam-text mt-1">Adding to library...</p>
                    </div>
                  )}
                  {paymentState === 'error' && (
                    <div className="flex flex-col items-center text-red-500 text-center p-4">
                      <p className="font-bold mb-2">Error</p>
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  )}
                </div>
              )}
              
              <Button 
                className="w-full py-4 text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#75b022] to-[#588a1b] hover:from-[#8ed629] hover:to-[#6aa621] text-white border-none"
                onClick={handleCheckout}
                disabled={paymentState !== 'idle'}
              >
                <CreditCard size={20} /> Checkout
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-steam-text text-center flex items-center justify-center gap-1">
              <CreditCard size={12} /> Secure encrypted payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for empty cart
const ShoppingCartIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="8" cy="21" r="1"/>
    <circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);
