import { NODES_CONFIG } from '../config/nodes';
import PatternPuzzle from '../components/puzzles/PatternPuzzle';
import SongPuzzle from '../components/puzzles/SongPuzzle';
import MemoryPuzzle from '../components/puzzles/MemoryPuzzle';
import ColorPuzzle from '../components/puzzles/ColorPuzzle';
import LogicPuzzle from '../components/puzzles/LogicPuzzle';
import SequencePuzzle from '../components/puzzles/SequencePuzzle';
import CipherPuzzle from '../components/puzzles/CipherPuzzle';
import FinalPuzzle from '../components/puzzles/FinalPuzzle';
import WhackAMolePuzzle from '../components/puzzles/WhackAMolePuzzle';
import QuotePuzzle from '../components/puzzles/QuotePuzzle';
import PerkPuzzle from '../components/puzzles/PerkPuzzle';
import InteractiveBackground from '../components/InteractiveBackground';

const puzzleComponents = {
  pattern: PatternPuzzle,
  song: SongPuzzle,
  memory: MemoryPuzzle,
  color: ColorPuzzle,
  logic: LogicPuzzle,
  sequence: SequencePuzzle,
  cipher: CipherPuzzle,
  final: FinalPuzzle,
  whackamole: WhackAMolePuzzle,
  quote: QuotePuzzle,
  perk: PerkPuzzle,
};

export default function NodePage({ 
  nodeId, 
  onBack, 
  isCompleted, 
  onComplete 
}) {
  const node = NODES_CONFIG.find((n) => n.id === nodeId);
  
  if (!node) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#d4a5b5]">Part not found</p>
      </div>
    );
  }

  const PuzzleComponent = puzzleComponents[node.puzzleType];

  const handlePuzzleComplete = () => {
    onComplete(nodeId);
  };

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Interactive floating background */}
      <InteractiveBackground />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-8">
          <button
            onClick={onBack}
            className="text-[#d4a5b5] hover:text-[#ff6b9d] text-sm mb-4 
              transition-colors duration-300 flex items-center gap-2 group"
          >
            <svg 
              className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Back to overview
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-[#f5e6e8] font-light tracking-wide flex items-center gap-3">
              <span className="text-xl">✨</span>
              {node.label}
            </h1>
            <span className={`text-xs px-4 py-1.5 rounded-full border ${
              isCompleted 
                ? 'bg-[#1f2d1f] border-[#6b9a6b]/40 text-[#b5d4b5]' 
                : 'bg-[#2d1f2d] border-[#ff6b9d]/30 text-[#d4a5b5]'
            }`}>
              {isCompleted ? '✓ Completed' : 'In Progress'}
            </span>
          </div>
          <p className="text-[#d4a5b5] text-sm mt-2">{node.description}</p>
        </header>

        {/* Puzzle Section */}
        <section className="p-6 bg-linear-to-br from-[#2d1f2d] to-[#1a1118] rounded-2xl border border-[#4a3a4a]">
          <h2 className="text-sm text-[#d4a5b5] mb-4 tracking-wide flex items-center gap-2">
         Challenge
          </h2>
          
          {PuzzleComponent && (
            <PuzzleComponent
              isCompleted={isCompleted}
              onComplete={handlePuzzleComplete}
            />
          )}
        </section>
      </div>
    </div>
  );
}
