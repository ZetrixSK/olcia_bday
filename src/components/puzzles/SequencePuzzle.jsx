import { useState } from 'react';

// EDIT THESE REVIEWS!
// Each review has: review text, answer, acceptedAnswers, options, correctIndex
const REVIEWS = [
  {
    review: "I found an AK-47 before I found food, I felt like a child in Congo. 10/10 would play again.",
    answer: "Rust",
    acceptedAnswers: ['rust'],
    options: ['The Last of Us', 'Resident Evil', 'Rust', 'Left 4 Dead'],
    correctIndex: 2,
  },
  {
    review: "Do devs listen? No. Is the game fun? No. Is the game balanced? No. Is the community toxic? Yes. Will i continue to play? Yes.",
    answer: "Dead By Daylight",
    acceptedAnswers: ['dbd', 'DBD', 'dead by daylight', 'Dead by daylight'],
    options: ['Stardew Valley', 'RimWorld', 'Dead By Daylight', 'Prison Architect'],
    correctIndex: 2,
  },
  {
    review: "Most fun I'd ever had playing with balls. Mind you, I spend a lot of time playing with balls.",
    answer: "Rocket League",
    acceptedAnswers: ['rocket league', 'rl', 'RL'],
    options: ['SimCity', 'Cities: Skylines', 'Rocket League', 'Tropico'],
    correctIndex: 2,
  },
  {
    review: "You can do everything you can't do in real life, like casting magic and talking to girls",
    answer: "The Witcher 3: Wild Hunt",
    acceptedAnswers: ['the witcher 3', 'witcher 3', 'the witcher', 'witcher'],
    options: ['Elden Ring', 'Bloodborne', 'The Witcher 3: Wild Hunt', 'Sekiro'],
    correctIndex: 2,
  },
  {
    review: "i liked the parts where i wasn't dying of starvation but did not like the parts where i was dying of everything else",
    answer: "Don't Starve Together",
    acceptedAnswers: ["don't starve together", "dont starve together", "dst", 'DST'],
    options: ['Divinity Original Sin 2', "Baldur's Gate 3", 'Pillars of Eternity', 'Don\'t Starve Together'],
    correctIndex: 3,
  },
  {
    review: "naked man hit me so i eat his family👍",
    answer: "The Forest",
    acceptedAnswers: ['the forest', 'forest'],
    options: ['Slay the Spire', 'Inscryption', 'The Forest', 'Hades'],
    correctIndex: 2,
  },
];

export default function SequencePuzzle({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [useOptionsMode, setUseOptionsMode] = useState(false);
  
  const currentReview = REVIEWS[currentIndex];
  const progress = (currentIndex / REVIEWS.length) * 100;
  const requiredCorrect = Math.ceil(REVIEWS.length * 0.6); // Need 60% correct

  const checkTextAnswer = () => {
    const userAnswer = inputValue.trim().toLowerCase();
    const correctAnswer = currentReview.answer.toLowerCase();
    const acceptedAnswers = currentReview.acceptedAnswers?.map(a => a.toLowerCase()) || [correctAnswer];
    
    if (acceptedAnswers.includes(userAnswer) || userAnswer === correctAnswer) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const checkAnswer = (selectedIndex) => {
    if (selectedIndex === currentReview.correctIndex) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      checkTextAnswer();
    }
  };

  const handleCorrect = () => {
    setFeedback('correct');
    setCorrectAnswers(prev => prev + 1);
  };

  const handleWrong = () => {
    setFeedback('wrong');
    setInputValue('');
    setTimeout(() => setFeedback(null), 1200);
  };

  const handleSkip = () => {
    setFeedback('skipped');
  };

  const handleNext = () => {
    setFeedback(null);
    setInputValue('');
    setUseOptionsMode(false);
    
    if (currentIndex + 1 >= REVIEWS.length) {
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
          {passed ? '🎮' : '😢'}
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${passed ? 'text-pink-400' : 'text-gray-400'}`}>
          {passed ? 'Great jobb!!' : 'Almost there!'}
        </h3>
        <p className="text-white/80 mb-4">
          You got {correctAnswers} out of {REVIEWS.length} correct!
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
              setInputValue('');
              setUseOptionsMode(false);
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
          className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-white font-bold drop-shadow">
            {currentIndex + 1} / {REVIEWS.length}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="flex justify-between text-sm text-white/70">
        <span>Score: {correctAnswers} ✓</span>
        <span>Need: {requiredCorrect} to pass</span>
      </div>

      {/* Review card */}
      <div className={`relative bg-[#2d1f2d] rounded-2xl p-6 transition-all duration-300 ${feedback === 'correct' ? 'ring-4 ring-green-400' : feedback === 'wrong' ? 'ring-4 ring-red-400' : ''}`}>
        {/* Badge */}
        <div className="absolute -top-3 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500 text-white">
            🎮 Guess the Game
          </span>
        </div>

        {/* Review text */}
        <div className="my-6">
          <p className="text-sm text-white/50 mb-2">Steam Review:</p>
          <blockquote className="text-lg md:text-xl text-white font-medium leading-relaxed italic border-l-4 border-pink-500/50 pl-4">
            "{currentReview.review}"
          </blockquote>
        </div>

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
                <p className="text-xl text-white">{currentReview.answer}</p>
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
            Next Question →
          </button>
        )}

        {/* Answer section */}
        {feedback !== 'correct' && feedback !== 'skipped' && (
          <div className="mt-6">
            {/* Toggle */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setUseOptionsMode(!useOptionsMode)}
                className="text-xs text-white/60 hover:text-white/90 underline transition-colors"
              >
                {useOptionsMode ? '✏️ Switch to text input' : '📋 Switch to multiple choice'}
              </button>
            </div>
            
            {useOptionsMode ? (
              <div className="grid grid-cols-2 gap-3">
                {currentReview.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(index)}
                    className="px-4 py-3 bg-[#1a1118] hover:bg-pink-500/30 border-2 border-pink-500/30 hover:border-pink-500 rounded-xl text-white font-medium transition-all hover:scale-105"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type the game name..."
                  className="w-full px-4 py-3 bg-[#1a1118] border-2 border-pink-500/30 rounded-xl text-white text-center text-lg focus:border-pink-500 focus:outline-none transition-colors"
                  autoFocus
                />
                <button
                  onClick={checkTextAnswer}
                  disabled={!inputValue.trim()}
                  className="w-full px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all"
                >
                  Submit
                </button>
              </div>
            )}
            
            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="mt-4 w-full px-4 py-2 bg-transparent hover:bg-white/5 border border-white/20 rounded-xl text-white/50 hover:text-white/80 text-sm transition-all"
            >
              ⏭️ Give up & reveal answer
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-center text-white/50 text-sm">
        Can you guess the game from the review?
        {!useOptionsMode && ' (not case sensitive)'}
      </p>
    </div>
  );
}
