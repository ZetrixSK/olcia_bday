import { useState } from 'react';

// Logic puzzle: Simple deduction
// Three items: flower, star, heart
// Three locations: garden, sky, chest
// Clues lead to: flower-garden, star-sky, heart-chest

const ITEMS = ['flower', 'star', 'heart'];
const LOCATIONS = ['garden', 'sky', 'chest'];
const SOLUTION = { flower: 'garden', star: 'sky', heart: 'chest' };
const ITEM_ICONS = { flower: '🌸', star: '⭐', heart: '💝' };
const LOCATION_ICONS = { garden: '🌿', sky: '☁️', chest: '📦' };

const CLUES = [
  'The flower belongs where things grow.',
  'The star is found above.',
  'The heart is kept safe and treasured.',
];

export default function LogicPuzzle({ isCompleted, onComplete }) {
  const [assignments, setAssignments] = useState(
    isCompleted ? SOLUTION : { flower: null, star: null, heart: null }
  );
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAssign = (item, location) => {
    if (isCompleted) return;
    
    // Remove this location from any other item
    const newAssignments = { ...assignments };
    for (const key of ITEMS) {
      if (newAssignments[key] === location) {
        newAssignments[key] = null;
      }
    }
    newAssignments[item] = location;
    setAssignments(newAssignments);
  };

  const handleCheck = () => {
    const correct = ITEMS.every(item => assignments[item] === SOLUTION[item]);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setTimeout(() => onComplete(), 500);
    } else {
      setTimeout(() => setShowResult(false), 1500);
    }
  };

  const handleReset = () => {
    setAssignments({ flower: null, star: null, heart: null });
    setShowResult(false);
    setIsCorrect(false);
  };

  const allAssigned = ITEMS.every(item => assignments[item] !== null);

  return (
    <div className="space-y-6">
      <p className="text-[#d4a5b5] text-sm">
        Match each item to its correct location using the clues.
      </p>

      {/* Clues */}
      <div className="space-y-2 p-4 bg-[#1a1118] rounded-xl border border-[#4a3a4a]">
        <p className="text-xs text-[#d4a5b5] mb-2 flex items-center gap-2">
          <span>📜</span> Clues
        </p>
        {CLUES.map((clue, i) => (
          <p key={i} className="text-[#ff6b9d] text-sm">
            {i + 1}. {clue}
          </p>
        ))}
      </div>

      {/* Assignment grid */}
      <div className="space-y-4">
        {ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-3 flex-wrap">
            <span className="w-20 text-[#f5e6e8] text-sm capitalize flex items-center gap-2">
              <span>{ITEM_ICONS[item]}</span> {item}
            </span>
            <div className="flex gap-2 flex-wrap">
              {LOCATIONS.map((location) => (
                <button
                  key={location}
                  onClick={() => handleAssign(item, location)}
                  disabled={isCompleted}
                  className={`
                    px-4 py-2 rounded-xl text-sm capitalize flex items-center gap-2
                    transition-all duration-300 soft-button
                    ${assignments[item] === location
                      ? isCompleted
                        ? 'bg-[#1f2d1f] border-2 border-[#6b9a6b] text-[#b5d4b5]'
                        : 'bg-[#ff6b9d]/20 border-2 border-[#ff6b9d] text-[#ff6b9d]'
                      : 'bg-[#2d1f2d] border-2 border-[#4a3a4a] text-[#d4a5b5] hover:border-[#ff6b9d]/50'
                    }
                    ${isCompleted ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <span>{LOCATION_ICONS[location]}</span> {location}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

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
            disabled={!allAssigned}
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
