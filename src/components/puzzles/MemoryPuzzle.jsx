import { useState } from 'react';

// Memory puzzle: Repeat a sequence
const SEQUENCE_LENGTH = 5;
const GRID_SIZE = 4;

export default function MemoryPuzzle({ isCompleted, onComplete }) {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [currentShow, setCurrentShow] = useState(-1);
  const [gameState, setGameState] = useState('idle'); // idle, showing, input, success, fail
  const [attempts, setAttempts] = useState(0);

  const generateSequence = () => {
    const newSequence = [];
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      newSequence.push(Math.floor(Math.random() * GRID_SIZE));
    }
    return newSequence;
  };

  const startGame = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setUserSequence([]);
    setGameState('showing');
    showSequence(newSequence);
  };

  const showSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setCurrentShow(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setCurrentShow(-1);
    }
    setGameState('input');
  };

  const handleCellClick = (index) => {
    if (isCompleted || gameState !== 'input') return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Check if correct so far
    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      setGameState('fail');
      setAttempts(attempts + 1);
      setTimeout(() => {
        setUserSequence([]);
        setGameState('idle');
      }, 1500);
      return;
    }

    // Check if complete
    if (newUserSequence.length === sequence.length) {
      setGameState('success');
      setTimeout(() => onComplete(), 500);
    }
  };

  const cells = ['🌸', '💫', '✨', '🌙'];

  return (
    <div className="space-y-6">
      <p className="text-[#d4a5b5] text-sm">
        Watch the sequence, then repeat it.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 max-w-52 mx-auto">
        {cells.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={isCompleted || gameState !== 'input'}
            className={`
              w-24 h-24 rounded-2xl border-2 text-3xl
              transition-all duration-300 ease-out
              ${currentShow === index
                ? 'bg-[#ff6b9d]/30 border-[#ff6b9d] text-[#ff6b9d] scale-105'
                : userSequence[userSequence.length - 1] === index && gameState === 'input'
                  ? 'bg-[#1f2d1f] border-[#6b9a6b] text-[#b5d4b5]'
                  : 'bg-[#2d1f2d] border-[#4a3a4a] text-[#d4a5b5]'
              }
              ${gameState === 'input' && !isCompleted 
                ? 'hover:border-[#ff6b9d]/50 cursor-pointer' 
                : 'cursor-default'}
            `}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Progress indicator */}
      {gameState === 'input' && (
        <div className="flex justify-center gap-2">
          {sequence.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < userSequence.length ? 'bg-[#ff6b9d] scale-110' : 'bg-[#4a3a4a]'
              }`}
            />
          ))}
        </div>
      )}

      {/* Status messages */}
      {gameState === 'idle' && !isCompleted && (
        <button
          onClick={startGame}
          className="block mx-auto px-8 py-3 bg-linear-to-r from-[#4a2639] to-[#6b3a55] 
            hover:from-[#5a3049] hover:to-[#7b4a65]
            rounded-xl text-[#f5e6e8] text-sm soft-button
            border border-[#ff6b9d]/20 hover:border-[#ff6b9d]/40"
        >
          {attempts > 0 ? '✨ Try again ✨' : '✨ Start ✨'}
        </button>
      )}

      {gameState === 'showing' && (
        <p className="text-center text-[#ff6b9d] text-sm animate-pulse flex items-center justify-center gap-2">
          <span>✨</span> Watch carefully... <span>✨</span>
        </p>
      )}

      {gameState === 'input' && (
        <p className="text-center text-[#d4a5b5] text-sm">
          Now repeat the sequence
        </p>
      )}

      {gameState === 'fail' && (
        <p className="text-center text-[#d4b5b5] text-sm flex items-center justify-center gap-2">
          <span>✦</span> Oops, try again <span>✦</span>
        </p>
      )}

      {gameState === 'success' && (
        <p className="text-center text-[#b5d4b5] text-sm flex items-center justify-center gap-2">
          <span>✨</span> Perfect <span>✨</span>
        </p>
      )}

      {isCompleted && (
        <p className="text-center text-[#b5d4b5] text-sm flex items-center justify-center gap-2">
          <span>✓</span> Challenge completed
        </p>
      )}
    </div>
  );
}
