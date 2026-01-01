import { useState } from 'react';

// EDIT THESE PERKS!
// Each perk has: image path, answer (correct perk name), and options array
// Put your perk images in public/perks/ folder (e.g., perk1.png, perk2.png, etc.)
const PERKS = [
  {
    image: '/perks/ruin.webp',
    answer: 'Hex: Ruin',
    options: ['Nemesis', 'Hysteria', 'Hex: Ruin', 'Hex: Retribution'],
  },
  {
    image: '/perks/coup.webp',
    answer: 'Coup de Grace',
    options: ['Septic Touch', 'Coup de Grace', 'Predator', 'Bloodhound'],
  },
  {
    image: '/perks/ms.webp',
    answer: 'Merciless Storm',
    options: ['Merciless Storm', 'Deadlock', 'Deerstalker', 'Eruption'],
  },
  {
    image: '/perks/bbq.webp',
    answer: 'Barbecue & Chilli',
    options: ['Fire Up', 'Barbecue & Chilli', 'Predator', 'Brutal Strength'],
  },
  {
    image: '/perks/nowayout.webp',
    answer: 'No Way Out',
    options: ['Corrupt Intervention', 'Discordance', 'Agitation', 'No Way Out'],
  },
  {
    image: '/perks/lethalpursuer.webp',
    answer: 'Lethal Pursuer',
    options: ['Monitor & Abuse', 'Lethal Pursuer', 'Enduring', 'Genetic Limits'],
  },
  {
    image: '/perks/alieninstinct.webp',
    answer: 'Alien Instinct',
    options: ['Alien Instinct', 'Hysteria', 'Play With Your Food', 'Rapid Brutality'],
  },
  {
    image: '/perks/darkarrogance.webp',
    answer: 'Dark Arrogance',
    options: ['Save The Best For Last', 'Sloppy Butcher', 'Thanatophobia', 'Dark Arrogance'],
  },
  {
    image: '/perks/starstruck.webp',
    answer: 'Starstruck',
    options: ['Starstruck', 'Mad Grit', 'Lightborn', 'Languid Touch'],
  },
  {
    image: '/perks/rmbrme.webp',
    answer: 'Remember Me',
    options: ['No Way Out', 'I\'m All Ears', 'Remember Me', 'Dragon\'s Grip'],
  },
];

export default function PerkPuzzle({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const currentPerk = PERKS[currentIndex];
  const progress = (currentIndex / PERKS.length) * 100;
  const requiredCorrect = Math.ceil(PERKS.length * 0.6); // Need 60% correct

  const checkAnswer = (selectedOption) => {
    if (selectedOption === currentPerk.answer) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const handleCorrect = () => {
    setFeedback('correct');
    setCorrectAnswers(prev => prev + 1);
  };

  const handleWrong = () => {
    setFeedback('wrong');
    setTimeout(() => setFeedback(null), 1200);
  };

  const handleSkip = () => {
    setFeedback('skipped');
  };

  const handleNext = () => {
    setFeedback(null);
    
    if (currentIndex + 1 >= PERKS.length) {
      setCompleted(true);
      if (correctAnswers >= requiredCorrect) {
        setTimeout(() => onComplete(), 1500);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (completed) {
    const passed = correctAnswers >= requiredCorrect;
    return (
      <div className="text-center py-8">
        <div className={`text-6xl mb-4 ${passed ? 'animate-bounce' : ''}`}>
          {passed ? '🔪' : '💀'}
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${passed ? 'text-pink-400' : 'text-gray-400'}`}>
          {passed ? 'Entity likes you!' : 'Entity Displeased...'}
        </h3>
        <p className="text-white/80 mb-4">
          You got {correctAnswers} out of {PERKS.length} correct!
        </p>
        {passed ? (
          <p className="text-pink-300">✨ You finished the challenges! ✨</p>
        ) : (
          <button
            onClick={() => {
              setCurrentIndex(0);
              setCorrectAnswers(0);
              setCompleted(false);
              setFeedback(null);
            }}
            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-full text-white font-semibold transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="relative h-3 bg-[#2d1f2d] rounded-full overflow-hidden">
        <div 
          className="h-full bg-linear-to-r from-red-500 to-pink-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-white font-bold drop-shadow">
            {currentIndex + 1} / {PERKS.length}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="flex justify-between text-sm text-white/70">
        <span>Score: {correctAnswers} ✓</span>
        <span>Need: {requiredCorrect} to pass</span>
      </div>

      {/* Perk card */}
      <div className={`relative bg-[#2d1f2d] rounded-2xl p-6 transition-all duration-300 ${feedback === 'correct' ? 'ring-4 ring-green-400' : feedback === 'wrong' ? 'ring-4 ring-red-400' : ''}`}>
        {/* Badge */}
        <div className="absolute -top-3 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
            🔪 DBD Perk Quiz
          </span>
        </div>

        {/* Perk image */}
        <div className="my-6 flex justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-[#4a3a4a] shadow-lg bg-[#1a1118]">
            <img 
              src={currentPerk.image} 
              alt="Mystery Perk"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <p className="text-center text-white/70 text-sm mb-4">Which perk is this?</p>

        {/* Feedback bar */}
        {feedback && (
          <div className={`mb-4 py-3 px-4 rounded-xl text-center font-bold text-lg ${
            feedback === 'correct' 
              ? 'bg-green-500/30 text-green-400 border border-green-500/50' 
              : feedback === 'skipped'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
              : 'bg-red-500/30 text-red-400 border border-red-500/50'
          }`}>
            {feedback === 'correct' && '✓ Correct!'}
            {feedback === 'wrong' && '✗ Try again!'}
            {feedback === 'skipped' && (
              <div>
                <p className="text-sm text-white/70 mb-1">The answer was:</p>
                <p className="text-xl text-white">{currentPerk.answer}</p>
              </div>
            )}
          </div>
        )}

        {/* Next button */}
        {(feedback === 'correct' || feedback === 'skipped') && (
          <button
            onClick={handleNext}
            className="w-full mb-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl text-white font-semibold transition-all"
          >
            Next Perk →
          </button>
        )}

        {/* Options */}
        {feedback !== 'correct' && feedback !== 'skipped' && (
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3">
              {currentPerk.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => checkAnswer(option)}
                  className="px-4 py-3 bg-[#1a1118] hover:bg-pink-500/30 border-2 border-pink-500/30 hover:border-pink-500 rounded-xl text-white font-medium transition-all hover:scale-105 text-sm md:text-base"
                >
                  {option}
                </button>
              ))}
            </div>
            
            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="mt-4 w-full px-4 py-2 bg-transparent hover:bg-white/5 border border-white/20 rounded-xl text-white/50 hover:text-white/80 text-sm transition-all"
            >
              Reveal the answer
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-center text-white/50 text-sm">
        Can you identify the perk from its icon?
      </p>
    </div>
  );
}
