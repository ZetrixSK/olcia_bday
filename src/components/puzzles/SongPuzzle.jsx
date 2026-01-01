import { useState, useRef } from 'react';

// EDIT THESE SONGS!
// Type "lyric" = guess song from lyrics, Type "audio" = guess song from audio snippets
// answer = the correct song name (for text input, case-insensitive)
// acceptedAnswers = optional array of alternative accepted answers
// options = 4 choices for multiple choice mode
const SONGS = [
  // GUESS FROM LYRICS - Show a lyric line, pick the song
  {
    type: 'lyric',
    lyric: '"I\'ve been quelling my urges to burst"',
    hint: 'Santanized',
    answer: 'Satanized',
    acceptedAnswers: ['satanized'],
    options: ['Year Zero', 'Mummy Dust', 'Satanized', 'Cirice'],
    correctIndex: 2,
    fullSong: '/songs/bohemian-full.mp3',
  },
  {
    type: 'lyric',
    lyric: '"In the shadows, death becomes your lover"',
    hint: 'From the album Skeletá"',
    answer: 'Umbra',
    acceptedAnswers: ['umbra'],
    options: ['Umbra', 'Guiding Lights', 'Devil Church', 'Majesty'],
    correctIndex: 0,
    fullSong: '/songs/rickroll-full.mp3',
  },
  
  // GUESS FROM AUDIO - Multiple snippets with hints
  {
    type: 'audio',
    question: 'What song is this?',
    snippets: [
      { file: '/songs/song1_1s.mp3', label: '1s' },
      { file: '/songs/song1_2s.mp3', label: '2s' },
    ],
    fullSong: '/songs/song1_full.mp3',
    answer: 'Ghuleh / Zombie Queen',
    acceptedAnswers: ['ghuleh', 'zombie queen', 'ghuleh / zombie queen'],
    options: ['Call Me Little Sunshine', 'Mary On A Cross', 'De Profundis Borealis', 'Ghuleh / Zombie Queen'],
    correctIndex: 3,
  },
  {
    type: 'audio',
    question: 'What song is this?',
    snippets: [
      { file: '/songs/song2_0.5s.mp3', label: '0.5s' },
      { file: '/songs/song2_1s.mp3', label: '1s' },
      { file: '/songs/song2_2s.mp3', label: '2s' },
    ],
    fullSong: '/songs/song2_full.mp3',
    answer: 'Darkness At The Heart Of My Love',
    acceptedAnswers: ['darkness at the heart of my love', 'DATHOML', 'dathoml'],
    options: ['Life Eternal', 'Darkness At The Heart Of My Love', 'Faith', 'Rats'],
    correctIndex: 1,
  },
  {
    type: 'audio',
    question: 'Which song is playing?',
    snippets: [
      { file: '/songs/song3_0.5s.mp3', label: '0.5s' },
      { file: '/songs/song3_1s.mp3', label: '1s' },
      { file: '/songs/song3_2s.mp3', label: '2s' },
    ],
    fullSong: '/songs/song3_full.mp3',
    answer: 'Dance Macabre',
    acceptedAnswers: ['dance macabre'],
    options: ['Dance Macabre', 'Spirit', 'Cirice', 'Majesty'],
    correctIndex: 0,
  },
  {
    type: 'audio',
    question: 'Which song is playing?',
    snippets: [
      { file: '/songs/song4_0.5s.mp3', label: '0.5s' },
      { file: '/songs/song4_1s.mp3', label: '1s' },
      { file: '/songs/song4_2s.mp3', label: '2s' },
    ],
    fullSong: '/songs/song4_full.mp3',
    answer: 'He Is',
    acceptedAnswers: ['he is'],
    options: ['Mummy Dust', 'Square Hammer', 'From The Pinnacle To The Pit', 'He Is'],
    correctIndex: 3,
  },
  {
    type: 'audio',
    question: 'Which song is playing?',
    snippets: [
      { file: '/songs/song5_0.5s.mp3', label: '0.5s' },
      { file: '/songs/song5_1s.mp3', label: '1s' },
      { file: '/songs/song5_2s.mp3', label: '2s' },
    ],
    fullSong: '/songs/song5_full.mp3',
    answer: 'Just A Dream',
    acceptedAnswers: ['just a dream'],
    options: ['Punkrocker', 'I Smoked Away My Brain', 'Hug Me', 'Just A Dream'],
    correctIndex: 3,
  },
  {
    type: 'audio',
    question: 'Which song is playing?',
    snippets: [
      { file: '/songs/song6_0.5s.mp3', label: '0.5s' },
      { file: '/songs/song6_1s.mp3', label: '1s' },
      { file: '/songs/song6_2s.mp3', label: '2s' },
    ],
    fullSong: '/songs/song6_full.mp3',
    answer: 'We Are The People',
    acceptedAnswers: ['we are the people', 'watp', 'WATP'],
    options: ['You Found Me', 'We Are The People', 'Ritual', 'Another Love'],
    correctIndex: 1,
  },
  {
    type: 'audio',
    question: 'Which song is playing?',
    snippets: [
      { file: '/songs/song7_0.5s.mp3', label: '0.5s' },
      { file: '/songs/song7_1s.mp3', label: '1s' },
      { file: '/songs/song7_2s.mp3', label: '2s' },
    ],
    fullSong: '/songs/song7_full.mp3',
    answer: 'Ostatnia Nocka',
    acceptedAnswers: ['ostatnia nocka'],
    options: ['Zanim pójdę', 'Mów mi dobrze', 'Ostatnia Nocka', 'Psychologa!!!'],
    correctIndex: 2,
  },
];

export default function SongPuzzle({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState(0);
  const [unlockedSnippets, setUnlockedSnippets] = useState([0]);
  const [playingFullSong, setPlayingFullSong] = useState(false);
  const [useOptionsMode, setUseOptionsMode] = useState(false); // false = text input, true = multiple choice
  const [inputValue, setInputValue] = useState('');
  const audioRef = useRef(null);
  const fullSongRef = useRef(null);
  
  const currentSong = SONGS[currentIndex];
  const progress = (currentIndex / SONGS.length) * 100;
  const requiredCorrect = Math.ceil(SONGS.length * 0.6); // Need 60% correct to pass

  const getCurrentSnippet = () => {
    if (currentSong.type === 'audio' && currentSong.snippets) {
      return currentSong.snippets[activeSnippet];
    }
    return null;
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const stopFullSong = () => {
    if (fullSongRef.current) {
      fullSongRef.current.pause();
      fullSongRef.current.currentTime = 0;
      setPlayingFullSong(false);
    }
  };

  const playFullSong = () => {
    if (fullSongRef.current && currentSong.fullSong) {
      fullSongRef.current.volume = 0.5;
      fullSongRef.current.play();
      setPlayingFullSong(true);
    }
  };

  const unlockNextSnippet = () => {
    if (currentSong.type === 'audio' && currentSong.snippets) {
      const nextIndex = unlockedSnippets.length;
      if (nextIndex < currentSong.snippets.length) {
        setUnlockedSnippets(prev => [...prev, nextIndex]);
        setActiveSnippet(nextIndex);
        stopAudio();
      }
    }
  };

  const selectSnippet = (index) => {
    if (unlockedSnippets.includes(index)) {
      stopAudio();
      setActiveSnippet(index);
    }
  };

  const checkTextAnswer = () => {
    const userAnswer = inputValue.trim().toLowerCase();
    const correctAnswer = currentSong.answer.toLowerCase();
    const acceptedAnswers = currentSong.acceptedAnswers?.map(a => a.toLowerCase()) || [correctAnswer];
    
    if (acceptedAnswers.includes(userAnswer) || userAnswer === correctAnswer) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const checkAnswer = (selectedIndex) => {
    if (selectedIndex === currentSong.correctIndex) {
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
    stopAudio();
    setFeedback('correct');
    setCorrectAnswers(prev => prev + 1);
    // Only play full song for audio type (snippets), not lyrics
    if (currentSong.type === 'audio' && currentSong.fullSong) {
      playFullSong();
    }
    // Don't auto-advance, wait for user to click Next
  };

  const handleWrong = () => {
    setFeedback('wrong');
    setInputValue('');
    // Clear wrong feedback after a moment so user can try again
    setTimeout(() => setFeedback(null), 1200);
  };

  const handleSkip = () => {
    stopAudio();
    setFeedback('skipped');
    // Don't auto-advance, wait for user to click Next
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  const nextQuestion = () => {
    stopFullSong();
    setFeedback(null);
    setShowHint(false);
    setIsPlaying(false);
    setActiveSnippet(0);
    setUnlockedSnippets([0]);
    setUseOptionsMode(false);
    setInputValue('');
    
    if (currentIndex + 1 >= SONGS.length) {
      if (correctAnswers >= requiredCorrect) {
        setCompleted(true);
        setTimeout(() => onComplete(), 2000);
      } else {
        setCompleted(true);
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
          {passed ? '🎉' : '😢'}
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${passed ? 'text-pink-400' : 'text-gray-400'}`}>
          {passed ? 'Good job!!!' : 'Awh man shucks.. try again ;)'}
        </h3>
        <p className="text-white/80 mb-4">
          You got {correctAnswers} out of {SONGS.length} correct!
        </p>
        {passed ? (
          <p className="text-pink-300">✨ 😲 Look what you unlocked 😲 ✨</p>
        ) : (
          <button
            onClick={() => {
              setCurrentIndex(0);
              setCorrectAnswers(0);
              setCompleted(false);
              setFeedback(null);
              setShowHint(false);
              setActiveSnippet(0);
              setUnlockedSnippets([0]);
              setUseOptionsMode(false);
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
          className="h-full bg-linear-to-r from-amber-500 to-pink-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-white font-bold drop-shadow">
            {currentIndex + 1} / {SONGS.length}
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
        {/* Type badge */}
        <div className="absolute -top-3 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentSong.type === 'lyric' ? 'bg-pink-500 text-white' : 'bg-amber-500 text-white'}`}>
            {currentSong.type === 'lyric' ? '📝 Guess from Lyrics' : '🎵 Guess from Audio'}
          </span>
        </div>

        {/* Content based on type */}
        {currentSong.type === 'lyric' ? (
          <div className="text-center my-6">
            <p className="text-sm text-white/50 mb-2">What song has this lyric?</p>
            <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed italic">
              {currentSong.lyric}
            </blockquote>
            
            {/* Full song audio for celebration */}
            {currentSong.fullSong && (
              <audio ref={fullSongRef} src={currentSong.fullSong} loop />
            )}
            
            {/* Hint button */}
            {!feedback && currentSong.hint && !showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="mt-4 px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-full text-white/80 text-sm transition-all"
              >
                💡 Need a hint?
              </button>
            )}
            {showHint && currentSong.hint && (
              <p className="mt-4 text-yellow-300/80 text-sm animate-pulse">
                Hint: {currentSong.hint}
              </p>
            )}
            
            {playingFullSong && (
              <div className="mt-4 text-green-400 animate-pulse flex items-center justify-center gap-2">
                <span className="text-2xl">🎉</span>
                <span>Now playing!</span>
                <span className="text-2xl">🎉</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center my-6">
            <p className="text-xl md:text-2xl text-white font-medium mb-4">
              {currentSong.question}
            </p>
            
            {/* Audio elements */}
            {getCurrentSnippet() && (
              <audio 
                ref={audioRef} 
                src={getCurrentSnippet().file}
                onEnded={() => setIsPlaying(false)}
              />
            )}
            {currentSong.fullSong && (
              <audio ref={fullSongRef} src={currentSong.fullSong} loop />
            )}
            
            {/* Snippet selector tabs */}
            <div className="flex justify-center gap-2 mb-4">
              {currentSong.snippets.map((snippet, index) => {
                const isUnlocked = unlockedSnippets.includes(index);
                const isActive = activeSnippet === index;
                return (
                  <button
                    key={index}
                    onClick={() => selectSnippet(index)}
                    disabled={!isUnlocked}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-amber-500 text-white scale-105' 
                        : isUnlocked 
                          ? 'bg-[#1a1118] text-white/80 hover:bg-amber-500/30' 
                          : 'bg-[#1a1118]/50 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {isUnlocked ? `🎵 ${snippet.label}` : `🔒 ${snippet.label}`}
                  </button>
                );
              })}
            </div>
            
            {/* Play button */}
            <button
              onClick={playAudio}
              disabled={feedback !== null}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl transition-all duration-300 ${isPlaying ? 'bg-amber-500 scale-110 animate-pulse' : 'bg-[#1a1118] hover:bg-amber-500/30 hover:scale-105'} border-4 border-amber-500 disabled:opacity-50 mx-auto`}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <p className="text-white/50 text-sm mt-3">
              {isPlaying ? `🎶 Playing ${getCurrentSnippet()?.label} clip...` : 'Click to play the snippet'}
            </p>
            
            {/* Hint button to unlock next snippet */}
            {!feedback && unlockedSnippets.length < currentSong.snippets.length && (
              <button
                onClick={unlockNextSnippet}
                className="mt-4 px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-full text-white/90 text-sm transition-all"
              >
                💡 Need a longer hint? ({currentSong.snippets[unlockedSnippets.length]?.label})
              </button>
            )}
            
            {playingFullSong && (
              <div className="mt-4 text-green-400 animate-pulse flex items-center justify-center gap-2">
                <span>Playing the full song!</span>
              </div>
            )}
          </div>
        )}

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
                <p className="text-xl text-white">{currentSong.answer}</p>
              </div>
            )}
          </div>
        )}

        {/* Next button - shown after correct or skipped */}
        {(feedback === 'correct' || feedback === 'skipped') && (
          <button
            onClick={handleNextQuestion}
            className="w-full mb-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            {playingFullSong}
            Next Question
          </button>
        )}

        {/* Answer section - text input or multiple choice */}
        {feedback !== 'correct' && feedback !== 'skipped' && (
          <div className="mt-6">
            {/* Toggle between input and options */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setUseOptionsMode(!useOptionsMode)}
                className="text-xs text-white/60 hover:text-white/90 underline transition-colors"
              >
                {useOptionsMode ? '✏️ Switch to text input' : '📋 Switch to multiple choice'}
              </button>
            </div>
            
            {useOptionsMode ? (
              // Multiple choice options
              <div className="grid grid-cols-2 gap-3">
                {currentSong.options.map((option, index) => (
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
              // Text input (default)
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type the song name..."
                    className="flex-1 px-4 py-3 bg-[#1a1118] border-2 border-pink-500/30 rounded-xl text-white text-center text-lg focus:border-pink-500 focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>
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
              Reveal the answer
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-center text-white/50 text-sm">
        {currentSong.type === 'lyric' 
          ? 'Which song contains this lyric?'
          : 'Listen to the clip and guess the song!'}
        {!useOptionsMode && ' (not case sensitive)'}
      </p>
    </div>
  );
}
