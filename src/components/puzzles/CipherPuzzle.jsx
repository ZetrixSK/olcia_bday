import { useState } from 'react';

// Simple Caesar cipher puzzle
// Encrypted: "KHOOR" (shift 3) -> "HELLO"
const ENCRYPTED = 'KHOOR';
const CORRECT_ANSWER = 'HELLO';
const HINT = 'Each letter has been shifted forward by 3 positions. Shift them back.';

export default function CipherPuzzle({ isCompleted, onComplete }) {
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCompleted || !answer.trim()) return;

    const correct = answer.trim().toUpperCase() === CORRECT_ANSWER;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setTimeout(() => onComplete(), 500);
    } else {
      setTimeout(() => {
        setShowResult(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setAnswer('');
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="space-y-6">
      <p className="text-[#d4a5b5] text-sm">
        Decode the secret message.
      </p>

      {/* Cipher display */}
      <div className="p-6 bg-[#1a1118] rounded-2xl border border-[#4a3a4a] text-center">
        <p className="text-xs text-[#d4a5b5] mb-3 flex items-center justify-center gap-2">
          <span>🔐</span> Encrypted Message
        </p>
        <p className="text-4xl text-[#ff6b9d] font-mono tracking-[0.3em]">
          {ENCRYPTED}
        </p>
      </div>

      {/* Hint */}
      <div className="text-center">
        {!showHint ? (
          <button
            onClick={() => setShowHint(true)}
            className="text-[#d4a5b5] hover:text-[#ff6b9d] text-sm
              transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <span>💡</span> Need a hint?
          </button>
        ) : (
          <p className="text-[#ff6b9d]/70 text-sm italic px-4">{HINT}</p>
        )}
      </div>

      {/* Input */}
      {!isCompleted && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <div className="gradient-border p-0.5 rounded-xl">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                placeholder="Type decoded message"
                maxLength={10}
                className="w-48 px-4 py-3 bg-[#1a1118] rounded-xl 
                  text-[#f5e6e8] placeholder-[#6b5a6b] text-center font-mono tracking-wider text-lg
                  focus:outline-none glow-input uppercase
                  transition-all duration-300"
              />
            </div>
          </div>

          {/* Result feedback */}
          {showResult && (
            <p className={`text-center text-sm flex items-center justify-center gap-2 ${
              isCorrect ? 'text-[#b5d4b5]' : 'text-[#d4b5b5]'
            }`}>
              {isCorrect ? (
                <><span>✨</span> Decoded <span>✨</span></>
              ) : (
                <><span>✦</span> Not quite <span>✦</span></>
              )}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-[#d4a5b5] hover:text-[#ff6b9d] text-sm
                transition-colors duration-300"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={!answer.trim()}
              className="px-6 py-2 bg-linear-to-r from-[#4a2639] to-[#6b3a55] 
                hover:from-[#5a3049] hover:to-[#7b4a65]
                rounded-xl text-[#f5e6e8] text-sm soft-button
                border border-[#ff6b9d]/20 hover:border-[#ff6b9d]/40
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300"
            >
              Decode
            </button>
          </div>
        </form>
      )}

      {isCompleted && (
        <div className="space-y-3 text-center">
          <p className="text-[#b5d4b5] font-mono tracking-wider text-xl">{CORRECT_ANSWER}</p>
          <p className="text-[#b5d4b5] text-sm flex items-center justify-center gap-2">
            <span>✓</span> Challenge completed
          </p>
        </div>
      )}
    </div>
  );
}
