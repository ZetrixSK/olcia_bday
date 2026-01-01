import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { NODES_CONFIG } from './config/nodes';
import GatePage from './pages/GatePage';
import HubPage from './pages/HubPage';
import NodePage from './pages/NodePage';
import CelebrationScreen from './components/CelebrationScreen';
import SparkleTrail from './components/SparkleTrail';

export default function App() {
  const {
    state,
    unlockGlobal,
    completeNode,
    markRewardOpened,
    markCelebrationSeen,
    isNodeCompleted,
  } = useGameState();

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check if all nodes are completed
  const allCompleted = NODES_CONFIG.every(node => state.completedNodes.includes(node.id));

  // Handle node completion - check if it was the last node (Summary)
  const handleNodeComplete = (nodeId) => {
    completeNode(nodeId);
    
    // Check if this was the last node (Summary) and celebration hasn't been seen
    const lastNode = NODES_CONFIG[NODES_CONFIG.length - 1];
    if (nodeId === lastNode.id && !state.celebrationSeen) {
      // Small delay before showing celebration
      setTimeout(() => {
        setShowCelebration(true);
      }, 1000);
    }
  };

  // Handle returning from celebration
  const handleCelebrationBack = () => {
    setShowCelebration(false);
    markCelebrationSeen();
    setSelectedNodeId(null);
  };

  // Gate page if not unlocked
  if (!state.isGloballyUnlocked) {
    return (
      <>
        <SparkleTrail />
        <GatePage onUnlock={unlockGlobal} />
      </>
    );
  }

  // Celebration screen
  if (showCelebration) {
    return (
      <>
        <SparkleTrail />
        <CelebrationScreen onBack={handleCelebrationBack} />
      </>
    );
  }

  // Node page if a node is selected
  if (selectedNodeId) {
    return (
      <>
        <SparkleTrail />
        <NodePage
          nodeId={selectedNodeId}
          onBack={() => setSelectedNodeId(null)}
          isCompleted={isNodeCompleted(selectedNodeId)}
          onComplete={handleNodeComplete}
        />
      </>
    );
  }

  // Hub page by default
  return (
    <>
      <SparkleTrail />
      <HubPage
        onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
        completedNodes={state.completedNodes}
        openedRewards={state.openedRewards}
        onRewardOpen={markRewardOpened}
        allCompleted={allCompleted}
      />
    </>
  );
}
