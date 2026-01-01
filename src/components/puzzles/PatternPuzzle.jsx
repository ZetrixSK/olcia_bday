import { useState } from 'react';

// Pattern: Find the next shape in a sequence
const PATTERN_SEQUENCE = ['★', '✦', '◆', '★', '✦', '◆', '★', '✦'];
const CORRECT_ANSWER = '◆';
const OPTIONS = ['★', '✦', '◆', '✧'];

export default function PatternPuzzle({ isCompleted, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option) => {
    if (isCompleted) return;
    setSelected(option);
    setShowResult(true);
    
    if (option === CORRECT_ANSWER) {
      setTimeout(() => onComplete(), 500);
    } else {
      setTimeout(() => {
        setShowResult(false);
        setSelected(null);
      }, 1500);
    }
  };

  const handleReset = () => {
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      <p className="text-[#d4a5b5] text-sm">
        Look at the pattern. What comes next?
      </p>

      {/* Sequence display */}
      <div className="flex items-center justify-center gap-3 py-4 flex-wrap">
        {PATTERN_SEQUENCE.map((shape, index) => (
          <span 
            key={index}
            className="text-2xl text-[#ff6b9d] opacity-80"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {shape}
          </span>
        ))}
        <span className="text-2xl text-[#d4a5b5] animate-pulse">?</span>
      </div>

      {/* Options */}
      <div className="flex justify-center gap-4 flex-wrap">
        {OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            disabled={isCompleted}
            className={`
              w-14 h-14 rounded-xl border-2 text-2xl
              transition-all duration-300 ease-out soft-button
              ${isCompleted && option === CORRECT_ANSWER
                ? 'bg-[#1f2d1f] border-[#6b9a6b] text-[#b5d4b5]'
                : selected === option
                  ? showResult && option === CORRECT_ANSWER
                    ? 'bg-[#1f2d1f] border-[#6b9a6b] text-[#b5d4b5]'
                    : 'bg-[#2d1f1f] border-[#9a6b6b] text-[#d4b5b5]'
                  : 'bg-[#2d1f2d] border-[#4a3a4a] text-[#ff6b9d] hover:border-[#ff6b9d]/50'
              }
              ${isCompleted ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Result feedback */}
      {showResult && selected && !isCompleted && (
        <p className={`text-center text-sm flex items-center justify-center gap-2 ${
          selected === CORRECT_ANSWER ? 'text-[#b5d4b5]' : 'text-[#d4b5b5]'
        }`}>
          {selected === CORRECT_ANSWER ? (
            <><span>✨</span> Correct <span>✨</span></>
          ) : (
            <><span>✦</span> Try again <span>✦</span></>
          )}
        </p>
      )}

      {isCompleted && (
        <p className="text-center text-[#b5d4b5] text-sm flex items-center justify-center gap-2">
          <span>✓</span> Challenge completed
        </p>
      )}

      {!isCompleted && selected && !showResult && (
        <button
          onClick={handleReset}
          className="block mx-auto text-[#d4a5b5] hover:text-[#ff6b9d] text-sm
            transition-colors duration-300"
        >
          Reset
        </button>
      )}
    </div>
  );
}
