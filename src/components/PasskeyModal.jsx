import { useState } from 'react';

export default function PasskeyModal({ isOpen, onClose, onSubmit }) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passkey.trim()) {
      onSubmit(passkey.trim());
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleClose = () => {
    setPasskey('');
    setError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-linear-to-br from-[#2d1f2d] to-[#1a1118] 
        border border-[#ff6b9d]/30 rounded-2xl 
        p-6 w-full max-w-sm mx-4 shadow-2xl">
        
        <div className="text-center mb-6">
          <span className="text-3xl mb-2 block">🔑</span>
          <h2 className="text-[#f5e6e8] text-lg font-light">
            Enter Passkey
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="gradient-border p-0.5 rounded-lg">
            <input
              type="text"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Type the secret phrase..."
              className="w-full px-4 py-3 bg-[#1a1118] rounded-lg 
                text-[#f5e6e8] placeholder-[#6b5a6b] text-sm
                focus:outline-none glow-input
                transition-all duration-300"
              autoFocus
            />
          </div>
          
          <div className="h-5 text-center">
            {error && (
              <p className="text-[#ff6b9d] text-sm flex items-center justify-center gap-2">
                <span>✦</span> Not the right key <span>✦</span>
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 bg-[#1a1118] border border-[#4a3a4a] rounded-xl
                text-[#d4a5b5] hover:text-[#f5e6e8] text-sm
                transition-all duration-300 hover:border-[#6b5a6b]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-linear-to-r from-[#4a2639] to-[#6b3a55] 
                hover:from-[#5a3049] hover:to-[#7b4a65]
                rounded-xl text-[#f5e6e8] text-sm soft-button
                border border-[#ff6b9d]/20 hover:border-[#ff6b9d]/40"
            >
              ✨ Unlock ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
