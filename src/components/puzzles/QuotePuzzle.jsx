import { useState } from 'react';

// EDIT THESE QUOTES! 
// Type "finish" = fill in the blank, Type "who" = guess who said it
const QUOTES = [
  // FINISH THE QUOTE - Player types in the missing word(s)
  {
    type: 'finish',
    quote: 'I am the one who ______',
    answer: 'knocks',
    hint: 'BrBa',
  },
  {
    type: 'finish',
    quote: 'I am _____ average height, so I\'m not that short',
    answer: 'below',
    hint: 'Just ola things',
  },
  {
    type: 'finish',
    quote: '__________ is your faaaavorite aaaalbum',
    answer: 'phantomime',
    hint: 'you know it.',
  },
  {
    type: 'finish',
    quote: '______ ass meg',
    answer: 'gooner',
    hint: 'dbd...',
  },
  
  // WHO SAID IT - Player picks from multiple choice
  /*{
    type: 'who',
    quote: '"This is the best day ever!"',
    options: ['Mom', 'Dad', 'Olcia', 'Grandma'],
    correctIndex: 2,
  },*/
];

export default function QuotePuzzle({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const currentQuote = QUOTES[currentIndex];
  const progress = (currentIndex / QUOTES.length) * 100;
  const requiredCorrect = Math.ceil(QUOTES.length * 0.75);

  const checkFinishAnswer = () => {
    const userAnswer = inputValue.trim().toLowerCase();
    const correctAnswer = currentQuote.answer.toLowerCase();
    const acceptedAnswers = currentQuote.acceptedAnswers?.map(a => a.toLowerCase()) || [correctAnswer];
    
    if (acceptedAnswers.includes(userAnswer)) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const checkWhoAnswer = (selectedIndex) => {
    if (selectedIndex === currentQuote.correctIndex) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const handleCorrect = () => {
    setFeedback('correct');
    setCorrectAnswers(prev => prev + 1);
    setTimeout(() => nextQuestion(), 1500);
  };

  const handleWrong = () => {
    setFeedback('wrong');
    setInputValue('');
    // Clear wrong feedback after a moment so user can try again
    setTimeout(() => setFeedback(null), 1200);
  };

  const handleSkip = () => {
    setFeedback('skipped');
    // Show answer for a moment then move on
    setTimeout(() => nextQuestion(), 3000);
  };

  const nextQuestion = () => {
    setFeedback(null);
    setInputValue('');
    setShowHint(false);
    
    if (currentIndex + 1 >= QUOTES.length) {
      if (correctAnswers + 1 >= requiredCorrect || (feedback === 'wrong' && correctAnswers >= requiredCorrect)) {
        setCompleted(true);
        setTimeout(() => onComplete(), 2000);
      } else {
        setCompleted(true);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      checkFinishAnswer();
    }
  };

  if (completed) {
    const passed = correctAnswers >= requiredCorrect;
    return (
      <div className="text-center py-8">
        <div className={`text-6xl mb-4 ${passed ? 'animate-bounce' : ''}`}>
          {passed ? '🎉' : '😢'}
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${passed ? 'text-pink-400' : 'text-gray-400'}`}>
          {passed ? 'Amazing!!' : 'So Close!'}
        </h3>
        <p className="text-white/80 mb-4">
          You got {correctAnswers} out of {QUOTES.length} correct!
        </p>
        {passed ? (
          <p className="text-pink-300">✨ Can you do the next part? ✨</p>
        ) : (
          <button
            onClick={() => {
              setCurrentIndex(0);
              setCorrectAnswers(0);
              setCompleted(false);
              setFeedback(null);
              setInputValue('');
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
          className="h-full bg-linear-to-r from-pink-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-white font-bold drop-shadow">
            {currentIndex + 1} / {QUOTES.length}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="flex justify-between text-sm text-white/70">
        <span>Score: {correctAnswers} ✓</span>
        <span>Need: {requiredCorrect} to pass</span>
      </div>

      {/* Question card */}
      <div className={`relative bg-[#2d1f2d] rounded-2xl p-6 transition-all duration-300 ${feedback === 'correct' ? 'ring-4 ring-green-400' : feedback === 'wrong' ? 'ring-4 ring-red-400' : ''}`}>
        {/* Quote type badge */}
        <div className="absolute -top-3 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentQuote.type === 'finish' ? 'bg-purple-500 text-white' : 'bg-pink-500 text-white'}`}>
            {currentQuote.type === 'finish' ? '✏️ Finish the Quote' : '🤔 Who Said It?'}
          </span>
        </div>

        {/* The quote */}
        <blockquote className="text-xl md:text-2xl text-white font-medium text-center my-6 leading-relaxed">
          "{currentQuote.quote}"
        </blockquote>

        {/* Feedback bar - non-overlapping */}
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
                <p className="text-xl text-white">
                  {currentQuote.type === 'finish' 
                    ? currentQuote.answer 
                    : currentQuote.options[currentQuote.correctIndex]}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Input area */}
        {feedback !== 'correct' && feedback !== 'skipped' && (
          <div className="mt-6">
            {currentQuote.type === 'finish' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type the missing word(s)..."
                  className="w-full px-4 py-3 bg-[#1a1118] border-2 border-pink-500/30 rounded-xl text-white text-center text-lg focus:border-pink-500 focus:outline-none transition-colors"
                  autoFocus
                />
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={checkFinishAnswer}
                    disabled={!inputValue.trim()}
                    className="px-6 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full text-white font-semibold transition-all"
                  >
                    Submit
                  </button>
                  {currentQuote.hint && !showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-full text-white/80 text-sm transition-all"
                    >
                      💡 Hint
                    </button>
                  )}
                </div>
                {showHint && currentQuote.hint && (
                  <p className="text-center text-yellow-300/80 text-sm animate-pulse">
                    Hint: {currentQuote.hint}
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {currentQuote.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => checkWhoAnswer(index)}
                    className="px-4 py-3 bg-[#1a1118] hover:bg-pink-500/30 border-2 border-pink-500/30 hover:border-pink-500 rounded-xl text-white font-medium transition-all hover:scale-105"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
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
        {currentQuote.type === 'finish' 
          ? 'Fill in the blank to complete the quote!'
          : 'Pick who said this quote!'}
      </p>
    </div>
  );
}
