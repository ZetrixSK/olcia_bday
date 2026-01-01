import { useState, useEffect, useCallback, useRef } from 'react';

const GAME_DURATION = 30000; // 30 seconds
const MOLE_SHOW_TIME = 1200; // How long a mole stays up
const MOLE_INTERVAL = 800; // How often to spawn a new mole
const WINNING_SCORE = 15;
// Grid of 9 holes (3x3)
const HOLES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Custom images for moles - put your images in src/assets/ folder
// and import them here, or use paths from the public folder
const MOLE_IMAGES = [
  '/moles/niel1.jpg',  // Put images in public/moles/ folder
  '/moles/niel2.jpg',
  '/moles/niel3.jpg',
];

export default function WhackAMolePuzzle({ isCompleted, onComplete }) {
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeMoles, setActiveMoles] = useState([]); // Array of { hole, image }
  const [hitEffect, setHitEffect] = useState(null);
  const gameRef = useRef(null);
  const timerRef = useRef(null);
  const moleTimerRef = useRef(null);

  // Get a random mole image
  const getRandomMoleImage = useCallback(() => {
    return MOLE_IMAGES[Math.floor(Math.random() * MOLE_IMAGES.length)];
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setActiveMoles([]);
  }, []);

  // Spawn moles
  useEffect(() => {
    if (gameState !== 'playing') return;

    moleTimerRef.current = setInterval(() => {
      const activeHoles = activeMoles.map(m => m.hole);
      const availableHoles = HOLES.filter(h => !activeHoles.includes(h));
      if (availableHoles.length === 0) return;

      const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
      const randomImage = getRandomMoleImage();
      const newMole = { hole: randomHole, image: randomImage };
      
      setActiveMoles(prev => [...prev, newMole]);

      // Remove mole after show time
      setTimeout(() => {
        setActiveMoles(prev => prev.filter(m => m.hole !== randomHole));
      }, MOLE_SHOW_TIME);
    }, MOLE_INTERVAL);

    return () => clearInterval(moleTimerRef.current);
  }, [gameState, activeMoles, getRandomMoleImage]);

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          clearInterval(timerRef.current);
          if (score >= WINNING_SCORE) {
            setGameState('won');
            setTimeout(() => onComplete(), 500);
          } else {
            setGameState('lost');
          }
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [gameState, score, onComplete]);

  // Check for win condition when score changes
  const checkWin = (newScore) => {
    if (gameState === 'playing' && newScore >= WINNING_SCORE) {
      clearInterval(timerRef.current);
      clearInterval(moleTimerRef.current);
      setGameState('won');
      setTimeout(() => onComplete(), 500);
    }
  };

  const whackMole = (holeIndex) => {
    if (gameState !== 'playing') return;
    
    const mole = activeMoles.find(m => m.hole === holeIndex);
    if (mole) {
      const newScore = score + 1;
      setScore(newScore);
      setActiveMoles(prev => prev.filter(m => m.hole !== holeIndex));
      setHitEffect(holeIndex);
      setTimeout(() => setHitEffect(null), 200);
      checkWin(newScore);
    }
  };

  const progressPercent = (score / WINNING_SCORE) * 100;
  const timePercent = (timeLeft / GAME_DURATION) * 100;

  return (
    <div className="space-y-6">
      <p className="text-[#d4a5b5] text-sm">
        Whack {WINNING_SCORE} niels before time runs out.
      </p>

      {/* Score and timer */}
      <div className="flex justify-between items-center gap-4 text-sm">
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="text-[#d4a5b5]">Score</span>
            <span className="text-[#ff6b9d]">{score}/{WINNING_SCORE}</span>
          </div>
          <div className="h-2 bg-[#2d1f2d] rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-[#ff6b9d] to-[#ff8a5c] transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
        
        {gameState === 'playing' && (
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-[#d4a5b5]">Time</span>
              <span className="text-[#ffd93d]">{Math.ceil(timeLeft / 1000)}s</span>
            </div>
            <div className="h-2 bg-[#2d1f2d] rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-[#ffd93d] to-[#ff8a5c] transition-all duration-100"
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Game grid */}
      <div 
        ref={gameRef}
        className={`grid grid-cols-3 gap-3 p-4 bg-[#2d1f2d] rounded-2xl border border-[#4a3a4a]
          ${gameState === 'playing' ? 'hammer-cursor' : ''}`}
      >
        {HOLES.map((hole) => {
          const mole = activeMoles.find(m => m.hole === hole);
          const hasMole = !!mole;
          const wasHit = hitEffect === hole;
          
          return (
            <button
              key={hole}
              onClick={() => whackMole(hole)}
              disabled={gameState !== 'playing'}
              className={`
                aspect-square rounded-xl flex items-center justify-center text-4xl
                transition-all duration-150 relative overflow-hidden
                ${hasMole 
                  ? 'bg-[#4a3a4a] scale-105' 
                  : 'bg-[#1a1118]'
                }
                ${wasHit ? 'hammer-hit bg-[#ff6b9d]/30' : ''}
                ${gameState === 'playing' ? 'hover:bg-[#3d2a3d] active:scale-95' : ''}
                border-2 border-[#4a3a4a]/50
              `}
            >
              {/* Hole */}
              <div className={`
                absolute inset-2 rounded-lg bg-[#0d0a0d] 
                flex items-center justify-center overflow-hidden
              `}>
                {/* Mole */}
                {hasMole && mole && (
                  <img 
                    src={mole.image}
                    alt="mole"
                    className={`
                      w-full h-full object-cover transition-transform duration-150
                      ${wasHit ? 'scale-0' : 'scale-100'}
                    `}
                  />
                )}
              </div>
              
              {/* Hit effect */}
              {wasHit && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl animate-ping">💥</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Game status messages */}
      {gameState === 'idle' && !isCompleted && (
        <div className="text-center">
          <button
            onClick={startGame}
            className="px-8 py-3 bg-linear-to-r from-[#4a2639] to-[#6b3a55] 
              hover:from-[#5a3049] hover:to-[#7b4a65]
              rounded-xl text-[#f5e6e8] text-sm tracking-wide soft-button
              border border-[#ff6b9d]/20 hover:border-[#ff6b9d]/40"
          >
            🔨 Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <p className="text-center text-[#d4a5b5] text-sm animate-pulse">
          Click the moles as they appear
        </p>
      )}

      {gameState === 'lost' && !isCompleted && (
        <div className="text-center space-y-3">
          <p className="text-[#ff6b9d] text-sm">
            Time's up. You got {score} moles.
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-[#2d1f2d] border border-[#ff6b9d]/30 rounded-xl
              text-[#f5e6e8] text-sm hover:border-[#ff6b9d]/60
              transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      )}

      {gameState === 'won' && (
        <p className="text-center text-[#b5d4b5] text-sm flex items-center justify-center gap-2">
          <span>✨</span> You did it <span>✨</span>
        </p>
      )}

      {isCompleted && gameState !== 'won' && (
        <p className="text-center text-[#b5d4b5] text-sm flex items-center justify-center gap-2">
          <span>✓</span> Challenge completed
        </p>
      )}
    </div>
  );
}
