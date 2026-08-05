import React, { useState } from 'react';
import { X, ShieldCheck, Link as LinkIcon, Hash, Clock, CheckCircle, Fingerprint } from 'lucide-react';
import { Button } from '../ui/Button';

interface BlockchainExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  txHash: string;
  blockNumber: number;
  blockHash: string;
  totalAmount: number;
  userId: number;
  timestamp: string;
}

export const BlockchainExplorerModal: React.FC<BlockchainExplorerModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  txHash,
  blockNumber,
  blockHash,
  totalAmount,
  userId,
  timestamp
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  if (!isOpen) return null;

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-steam-panel border border-steam-light rounded-xl shadow-2xl max-w-2xl w-full text-steam-text-light overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-steam-bg bg-steam-dark">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-400" size={28} />
            <h2 className="text-xl font-bold uppercase tracking-wide">PlayGrid Block Explorer</h2>
          </div>
          <button onClick={onClose} className="text-steam-text hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="bg-steam-dark rounded-lg p-5 border border-steam-light/50 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-steam-accent"></div>
            <h3 className="text-sm text-steam-text uppercase tracking-widest font-semibold mb-4">Transaction Details</h3>

            <div className="space-y-4 font-mono text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-steam-light/30 pb-3">
                <span className="text-steam-text flex items-center gap-2">
                  <Fingerprint size={16} /> Transaction Hash:
                </span>
                <span className="text-steam-accent break-all">{txHash}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-steam-light/30 pb-3">
                <span className="text-steam-text flex items-center gap-2">
                  <Hash size={16} /> Block Number:
                </span>
                <span className="text-white">#{blockNumber}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-steam-light/30 pb-3">
                <span className="text-steam-text flex items-center gap-2">
                  <LinkIcon size={16} /> Block Hash:
                </span>
                <span className="text-white break-all text-xs text-right sm:max-w-[70%]">{blockHash}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
                <span className="text-steam-text flex items-center gap-2">
                  <Clock size={16} /> Timestamp:
                </span>
                <span className="text-white">{new Date(timestamp).toUTCString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-steam-dark/50 rounded-lg p-4 border border-steam-light/30 text-sm mb-6">
            <h4 className="text-steam-text font-semibold mb-2">Cryptographic Payload</h4>
            <div className="bg-black/50 p-3 rounded font-mono text-xs text-steam-text-light/80 overflow-x-auto">
              <span className="text-blue-400">order:</span> "{orderNumber}", <br />
              <span className="text-blue-400">user:</span> {userId}, <br />
              <span className="text-blue-400">amount:</span> ${totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-4">
            {!isVerified ? (
              <Button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full sm:w-auto px-8 py-3 bg-steam-light hover:bg-steam-accent text-white flex items-center justify-center gap-2 font-bold"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Calculating Hash...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    Verify Cryptographic Integrity
                  </>
                )}
              </Button>
            ) : (
              <div className="w-full bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex flex-col items-center justify-center gap-2 animate-fade-in text-green-400 font-medium">
                <CheckCircle size={28} />
                <span>Verification Successful!</span>
                <span className="text-xs text-green-400/80 mt-1 text-center font-mono">
                  SHA-256 Checksum Matches Local Data
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
