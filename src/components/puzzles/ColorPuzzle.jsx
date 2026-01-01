import { useState } from 'react';

// Color sequence puzzle: Match the pattern
const COLORS = [
  { name: 'amber', class: 'bg-[#b39d7a]' },
  { name: 'sage', class: 'bg-[#7a9a7a]' },
  { name: 'rust', class: 'bg-[#9a7a6a]' },
  { name: 'slate', class: 'bg-[#6a7a8a]' },
];

const TARGET_SEQUENCE = [0, 2, 1, 3, 0]; // amber, rust, sage, slate, amber

export default function ColorPuzzle({ isCompleted, onComplete }) {
  const [userSequence, setUserSequence] = useState(isCompleted ? TARGET_SEQUENCE : []);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleColorClick = (colorIndex) => {
    if (isCompleted || userSequence.length >= 5) return;
    setUserSequence([...userSequence, colorIndex]);
  };

  const handleCheck = () => {
    const correct = userSequence.length === TARGET_SEQUENCE.length &&
      userSequence.every((c, i) => c === TARGET_SEQUENCE[i]);
    
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
    setUserSequence([]);
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleRemoveLast = () => {
    setUserSequence(userSequence.slice(0, -1));
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      <p className="text-[#8a8279] text-sm">
        The pattern begins with warmth, visits earth, passes through growth, 
        touches distance, and returns to warmth. Recreate it.
      </p>

      {/* User sequence display */}
      <div className="min-h-15 p-4 bg-[#252220] rounded-xl border border-[#3a3633]">
        {userSequence.length > 0 ? (
          <div className="flex justify-center gap-2">
            {userSequence.map((colorIdx, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg ${COLORS[colorIdx].class} 
                  transition-all duration-300`}
              />
            ))}
            {!isCompleted && userSequence.length < 5 && (
              <div className="w-10 h-10 rounded-lg border-2 border-dashed border-[#3a3633]" />
            )}
          </div>
        ) : (
          <p className="text-[#4a4540] text-sm text-center">
            Select colors below to build the sequence
          </p>
        )}
      </div>

      {/* Color palette */}
      {!isCompleted && (
        <div className="flex justify-center gap-3">
          {COLORS.map((color, index) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(index)}
              disabled={userSequence.length >= 5}
              className={`
                w-12 h-12 rounded-xl ${color.class} border-2 border-transparent
                hover:border-[#e8e4df]/30 hover:scale-105
                transition-all duration-300 ease-out
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              title={color.name}
            />
          ))}
        </div>
      )}

      {/* Result feedback */}
      {showResult && !isCompleted && (
        <p className={`text-center text-sm ${
          isCorrect ? 'text-[#7a9a7a]' : 'text-[#9a7a7a]'
        }`}>
          {isCorrect ? 'Correct' : 'Incorrect pattern'}
        </p>
      )}

      {isCompleted && (
        <p className="text-center text-[#6b6560] text-sm">
          Challenge completed
        </p>
      )}

      {/* Actions */}
      {!isCompleted && (
        <div className="flex justify-center gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-[#6b6560] hover:text-[#8a8279] text-sm
              transition-colors duration-300"
          >
            Reset
          </button>
          {userSequence.length > 0 && (
            <button
              onClick={handleRemoveLast}
              className="px-4 py-2 text-[#6b6560] hover:text-[#8a8279] text-sm
                transition-colors duration-300"
            >
              Undo
            </button>
          )}
          <button
            onClick={handleCheck}
            disabled={userSequence.length !== 5}
            className="px-4 py-2 bg-[#2a2724] border border-[#3a3633] rounded-lg
              text-[#c5bfb7] text-sm hover:bg-[#33302c]
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
