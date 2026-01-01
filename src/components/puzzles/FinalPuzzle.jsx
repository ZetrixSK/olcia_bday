import { useState } from 'react';
import CelebrationScreen from '../CelebrationScreen';

// Final puzzle: Simple acknowledgment
export default function FinalPuzzle({ isCompleted, onComplete }) {
  const [confirmed, setConfirmed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleConfirm = () => {
    if (isCompleted) return;
    setConfirmed(true);
    setShowCelebration(true);
    setTimeout(() => onComplete(), 500);
  };

  const handleBackFromCelebration = () => {
    setShowCelebration(false);
  };

  // Show celebration screen
  if (showCelebration || (isCompleted && showCelebration)) {
    return <CelebrationScreen onBack={handleBackFromCelebration} />;
  }

  return (
    <div className="space-y-6">
      <p className="text-[#d4a5b5] text-sm text-center">
        ✨ All parts have been completed ✨
      </p>

      <div className="p-6 bg-[#1a1118] rounded-2xl border border-[#4a3a4a] text-center space-y-4">
        <div className="flex justify-center gap-2">
          {['🌸', '💫', '✨', '🌺', '🌙'].map((emoji, i) => (
            <span
              key={i}
              className={`text-xl ${
                isCompleted || confirmed ? 'opacity-100' : 'opacity-30'
              } transition-opacity duration-500`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {emoji}
            </span>
          ))}
        </div>
        
        <p className="text-[#ff6b9d] text-sm">
          {isCompleted || confirmed 
            ? '✨ Journey complete ✨' 
            : 'Ready to finish your adventure?'}
        </p>
      </div>

      {!isCompleted && !confirmed && (
        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            className="px-8 py-3 bg-linear-to-r from-[#4a2639] to-[#6b3a55] 
              hover:from-[#5a3049] hover:to-[#7b4a65]
              rounded-xl text-[#f5e6e8] text-sm soft-button
              border border-[#ff6b9d]/20 hover:border-[#ff6b9d]/40
              transition-all duration-300 flex items-center gap-2"
          >
            <span>🎀</span> Complete <span>🎀</span>
          </button>
        </div>
      )}

      {isCompleted && !showCelebration && (
        <div className="space-y-4">
          <p className="text-center text-[#b5d4b5] text-sm flex items-center justify-center gap-2">
            <span>✓</span> Thank you for playing! <span>✨</span>
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setShowCelebration(true)}
              className="px-6 py-2 bg-linear-to-r from-[#4a2639] to-[#6b3a55] 
                hover:from-[#5a3049] hover:to-[#7b4a65]
                rounded-xl text-[#f5e6e8] text-sm soft-button
                border border-[#ff6b9d]/20 hover:border-[#ff6b9d]/40
                transition-all duration-300 flex items-center gap-2"
            >
              <span>🎆</span> Watch Celebration Again <span>🎆</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
