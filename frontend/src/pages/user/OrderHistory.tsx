import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../../services/order';
import { Order } from '../../types';
import { ShoppingBag, Calendar, CreditCard, CheckCircle2, Package, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BlockchainExplorerModal } from '../../components/game/BlockchainExplorerModal';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedOrderForExplorer, setSelectedOrderForExplorer] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order history.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-steam-text">
        <Loader2 size={48} className="animate-spin text-steam-accent mb-4" />
        <p className="text-lg font-semibold">Loading purchase history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-steam-text mb-6">
        <Link to="/profile" className="hover:text-steam-text-light flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Profile
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8 border-b border-steam-panel pb-4">
        <div>
          <h1 className="text-3xl font-bold text-steam-text-light uppercase tracking-wider flex items-center gap-3">
            <ShoppingBag className="text-steam-accent" size={32} />
            Purchase History
          </h1>
          <p className="text-steam-text text-sm mt-1">
            View all past transactions, itemized receipts, and order numbers.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-steam-panel p-12 rounded-lg text-center shadow-lg border border-steam-dark">
          <Package size={64} className="mx-auto text-steam-text/40 mb-4" />
          <h2 className="text-2xl font-bold text-steam-text-light mb-2">No Orders Found</h2>
          <p className="text-steam-text mb-6">You haven't made any purchases on PlayGrid yet.</p>
          <Link to="/">
            <Button variant="primary">Browse Store</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-steam-panel rounded-lg border border-steam-dark overflow-hidden shadow-lg hover:border-steam-accent/40 transition-colors"
            >
              {/* Order Header */}
              <div className="bg-steam-dark/60 p-4 border-b border-steam-dark flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-steam-accent/10 p-2.5 rounded-lg border border-steam-accent/20">
                    <CheckCircle2 size={24} className="text-steam-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-steam-text uppercase tracking-wider">Order Reference</div>
                    <div className="font-mono text-lg font-bold text-steam-text-light">{order.orderNumber}</div>
                  </div>
                </div>

                {order.txHash && (
                  <div className="flex-1 min-w-[200px] flex items-center justify-center sm:justify-start">
                    <button 
                      onClick={() => setSelectedOrderForExplorer(order)}
                      className="bg-steam-dark border border-green-500/30 hover:border-green-500/60 hover:bg-green-500/10 transition-all px-3 py-1.5 rounded-full flex items-center gap-2 group"
                    >
                      <ShieldCheck size={16} className="text-green-500 group-hover:animate-pulse" />
                      <span className="text-xs font-semibold text-green-400">On-Chain Verified (Block #{order.blockNumber})</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-steam-text">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-steam-accent" />
                    <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CreditCard size={16} className="text-steam-accent" />
                    <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-steam-text uppercase">Total Paid</div>
                    <div className="text-lg font-bold text-steam-accent">${order.totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="p-4 divide-y divide-steam-dark">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-steam-accent"></div>
                      <div>
                        <Link 
                          to={`/games/${item.gameId}`}
                          className="font-bold text-steam-text-light hover:text-steam-accent transition-colors"
                        >
                          {item.gameTitle}
                        </Link>
                        {item.discountPercentage > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-900/60 text-green-400 font-bold rounded">
                            -{item.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right font-medium">
                      {item.discountPercentage > 0 && (
                        <span className="text-xs text-steam-text/60 line-through mr-2">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-steam-text-light font-bold">
                        ${item.finalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrderForExplorer && (
        <BlockchainExplorerModal 
          isOpen={true}
          onClose={() => setSelectedOrderForExplorer(null)}
          orderNumber={selectedOrderForExplorer.orderNumber}
          txHash={selectedOrderForExplorer.txHash || ''}
          blockNumber={selectedOrderForExplorer.blockNumber || 0}
          blockHash={selectedOrderForExplorer.blockHash || ''}
          totalAmount={selectedOrderForExplorer.totalAmount}
          userId={selectedOrderForExplorer.userId}
          timestamp={selectedOrderForExplorer.createdAt}
        />
      )}
    </div>
  );
};
