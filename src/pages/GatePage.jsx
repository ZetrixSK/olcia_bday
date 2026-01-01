import { useState } from 'react';
import { GLOBAL_PASSWORD } from '../config/nodes';
import InteractiveBackground from '../components/InteractiveBackground';

export default function GatePage({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === GLOBAL_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Interactive floating background */}
      <InteractiveBackground />

      <div className="w-full max-w-sm px-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2 title-gradient">
              ✨ Welcome ✨
            </h1>
            <p className="text-[#ffb6c1] text-sm tracking-wide">
              Enter the secret key to continue
            </p>
          </div>
          
          <div className="gradient-border p-1">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="✦ ✦ ✦ ✦ ✦ ✦"
              className="w-full px-5 py-4 bg-[#1a1118] rounded-lg 
                text-[#f5e6e8] placeholder-[#6b4a5a] text-center tracking-[0.3em]
                focus:outline-none glow-input
                transition-all duration-300 ease-out"
              autoFocus
            />
          </div>

          <div className="h-6 flex items-center justify-center">
            {error && (
              <p className="text-[#ff6b9d] text-sm flex items-center gap-2">
                <span>✦</span> Not quite right <span>✦</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-linear-to-r from-[#4a2639] to-[#6b3a55] 
              hover:from-[#5a3049] hover:to-[#7b4a65]
              rounded-xl text-[#f5e6e8] text-sm tracking-widest uppercase
              transition-all duration-300 ease-out soft-button
              border border-[#ff6b9d]/20 hover:border-[#ff6b9d]/40"
          >
            ✨ Enter ✨
          </button>
        </form>

        {/* Bottom decorative dots */}
        <div className="flex justify-center gap-2 mt-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#ff6b9d]/30"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
