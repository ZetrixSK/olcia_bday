// Node configuration for the experience
// Each node has: id, label, type, unlock conditions
// Nodes unlock sequentially - each requires the previous to be completed

export const NODES_CONFIG = [
  {
    id: 'node-01',
    label: 'Part One',
    description: 'Do you remember these?',
    puzzleType: 'quote',
    // First node - always available
  },
  {
    id: 'node-02',
    label: 'Part Two',
    description: 'Guess the songs!',
    puzzleType: 'song',
    // Requires Part One
  },
  {
    id: 'node-03',
    label: 'Part Three',
    description: 'Whack the niels!',
    puzzleType: 'whackamole',
    // Requires Part Two
  },
  {
    id: 'node-04',
    label: 'Part Four',
    description: 'Which game is it?',
    puzzleType: 'sequence',
    // Requires Part Three
  },
  {
    id: 'node-05',
    label: 'Part Five',
    description: 'Name that perk!',
    puzzleType: 'perk',
    // Requires Part Four
  },
  {
    id: 'node-06',
    label: 'Summary',
    description: 'The final step',
    puzzleType: 'final',
    // Requires Part Five - triggers celebration when completed
  },
];

// Rewards shown after all parts are completed and celebration is done
// These appear as 2 clickable gift boxes on the hub
export const REWARDS_CONFIG = [
  {
    id: 'reward-01',
    label: 'Terraria',
    icon: '🎁',
    type: 'text',
    content: 'Check Steam!',
    description: 'Game',
  },
  {
    id: 'reward-02',
    label: 'Green Hell',
    icon: '🎀',
    type: 'text',
    content: 'Check Steam!',
    description: 'Game',
  },
  {
    id: 'reward-03',
    label: 'DBD 1100 Auric Cells',
    icon: '🥯',
    type: 'text',
    content: 'A PaySafeCard you can use on DBD!',
    description: 'Currency',
  },
];

export const GLOBAL_PASSWORD = 'olcia2026';
