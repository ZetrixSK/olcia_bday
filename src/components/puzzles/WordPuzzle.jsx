import { useState, useMemo } from 'react';

// Word puzzle: Arrange words to form a phrase
const WORDS = ['light', 'the', 'follows', 'shadow'];
const CORRECT_ORDER = ['the', 'shadow', 'follows', 'light'];

// Shuffle function outside component
const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function WordPuzzle({ isCompleted, onComplete }) {
  const initialWords = useMemo(() => isCompleted ? [] : shuffleArray(WORDS), [isCompleted]);
  const [arranged, setArranged] = useState([]);
  const [available, setAvailable] = useState(initialWords);
  const [showResult, setShowResult] = useState(false);

  const handleWordClick = (word, fromArranged) => {
    if (isCompleted) return;

    if (fromArranged) {
      setArranged(arranged.filter((w) => w !== word));
      setAvailable([...available, word]);
    } else {
      setAvailable(available.filter((w) => w !== word));
      setArranged([...arranged, word]);
    }
  };

  const handleCheck = () => {
    const isCorrect = arranged.length === CORRECT_ORDER.length &&
      arranged.every((word, i) => word === CORRECT_ORDER[i]);
    
    setShowResult(true);
    
    if (isCorrect) {
      setTimeout(() => onComplete(), 500);
    } else {
      setTimeout(() => setShowResult(false), 1500);
    }
  };

  const handleReset = () => {
    setArranged([]);
    setAvailable(shuffleArray(WORDS));
    setShowResult(false);
  };

  const isCorrect = arranged.length === CORRECT_ORDER.length &&
    arranged.every((word, i) => word === CORRECT_ORDER[i]);

  return (
    <div className="space-y-6">
      <p className="text-[#d4a5b5] text-sm">
        Arrange the words into a meaningful phrase.
      </p>

      {/* Arranged area */}
      <div className="min-h-16 p-4 bg-[#1a1118] rounded-xl border-2 border-dashed border-[#4a3a4a]">
        {isCompleted ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {CORRECT_ORDER.map((word, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-[#1f2d1f] border border-[#6b9a6b]/40 
                  rounded-xl text-[#b5d4b5] text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        ) : arranged.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {arranged.map((word, i) => (
              <button
                key={i}
                onClick={() => handleWordClick(word, true)}
                className="px-4 py-2 bg-[#3d2a3d] border border-[#ff6b9d]/30 
                  rounded-xl text-[#f5e6e8] text-sm hover:border-[#ff6b9d]/60
                  transition-all duration-300 soft-button"
              >
                {word}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[#6b5a6b] text-sm text-center py-2">
            ✨ Tap words below to arrange them ✨
          </p>
        )}
      </div>

      {/* Available words */}
      {!isCompleted && (
        <div className="flex flex-wrap gap-2 justify-center">
          {available.map((word, i) => (
            <button
              key={i}
              onClick={() => handleWordClick(word, false)}
              className="px-4 py-2 bg-[#2d1f2d] border border-[#4a3a4a] 
                rounded-xl text-[#d4a5b5] text-sm hover:border-[#ff6b9d]/50
                hover:text-[#ff6b9d] transition-all duration-300 soft-button"
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {/* Result feedback */}
      {showResult && !isCompleted && (
        <p className={`text-center text-sm flex items-center justify-center gap-2 ${
          isCorrect ? 'text-[#b5d4b5]' : 'text-[#d4b5b5]'
        }`}>
          {isCorrect ? (
            <><span>✨</span> Perfect <span>✨</span></>
          ) : (
            <><span>✦</span> Not quite right <span>✦</span></>
          )}
        </p>
      )}

      {isCompleted && (
        <p className="text-center text-[#b5d4b5] text-sm flex items-center justify-center gap-2">
          <span>✓</span> Challenge completed
        </p>
      )}

      {/* Actions */}
      {!isCompleted && (
        <div className="flex justify-center gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-[#d4a5b5] hover:text-[#ff6b9d] text-sm
              transition-colors duration-300"
          >
            Reset
          </button>
          <button
            onClick={handleCheck}
            disabled={arranged.length !== WORDS.length}
            className="px-6 py-2 bg-linear-to-r from-[#4a2639] to-[#6b3a55] 
              hover:from-[#5a3049] hover:to-[#7b4a65]
              rounded-xl text-[#f5e6e8] text-sm soft-button
              border border-[#ff6b9d]/20 hover:border-[#ff6b9d]/40
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300"
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}
