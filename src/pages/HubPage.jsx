import { useState } from 'react';
import { NODES_CONFIG, REWARDS_CONFIG } from '../config/nodes';
import NodeCard from '../components/NodeCard';
import InteractiveBackground from '../components/InteractiveBackground';

export default function HubPage({ 
  onSelectNode, 
  completedNodes,
  openedRewards,
  onRewardOpen,
  allCompleted,
}) {
  const [selectedReward, setSelectedReward] = useState(null);

  // Sequential unlock: each node requires all previous nodes to be completed
  const getNodeStatus = (node, index) => {
    if (completedNodes.includes(node.id)) {
      return 'completed';
    }

    // First node is always available
    if (index === 0) {
      return 'available';
    }

    // Check if previous node is completed
    const previousNode = NODES_CONFIG[index - 1];
    if (previousNode && completedNodes.includes(previousNode.id)) {
      return 'available';
    }

    return 'locked';
  };

  const handleNodeClick = (node, index) => {
    const status = getNodeStatus(node, index);
    
    if (status === 'available' || status === 'completed') {
      onSelectNode(node.id);
    }
  };

  const handleRewardClick = (reward) => {
    setSelectedReward(reward);
    onRewardOpen(reward.id);
  };

  const closeRewardPopup = () => {
    setSelectedReward(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Interactive floating background */}
      <InteractiveBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-14 text-center">
          <div className="inline-block mb-5">
            <span className="text-6xl drop-shadow-lg">🎂</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-wide mb-4 title-gradient">
            Olcia Birthday 2026
          </h1>
          <p className="text-[#ffb6c1] text-base flex items-center justify-center gap-3 font-medium">
            <span className="text-[#ff6b9d] text-lg">✦</span>
            {completedNodes.length} of {NODES_CONFIG.length} parts completed
            <span className="text-[#ff6b9d] text-lg">✦</span>
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {NODES_CONFIG.map((node, index) => {
            const status = getNodeStatus(node, index);
            return (
              <NodeCard
                key={node.id}
                node={node}
                status={status}
                onClick={() => handleNodeClick(node, index)}
                index={index}
              />
            );
          })}
        </div>

        {/* Rewards Section - Only shows after all parts are completed */}
        {allCompleted && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-[#f5e6e8] font-light tracking-wide flex items-center justify-center gap-3">
                <span className="text-xl">🎉</span>
                Your Gifts
                <span className="text-xl">🎉</span>
              </h2>
              <p className="text-[#d4a5b5] text-sm mt-2">Click each gift to reveal your reward!</p>
            </div>
            
            <div className="flex justify-center gap-6 flex-wrap">
              {REWARDS_CONFIG.map((reward) => {
                const isOpened = openedRewards.includes(reward.id);
                return (
                  <button
                    key={reward.id}
                    onClick={() => handleRewardClick(reward)}
                    className={`
                      relative w-24 h-24 rounded-2xl
                      transition-all duration-300 transform hover:scale-110
                      ${isOpened 
                        ? 'bg-linear-to-br from-[#3d2d3d] to-[#2d1f2d] border-[#6b5a6b]' 
                        : 'bg-linear-to-br from-[#ff6b9d]/20 to-[#ffb6c1]/20 border-[#ff6b9d]/50 animate-pulse'
                      }
                      border-2 flex items-center justify-center
                      hover:shadow-[0_0_30px_rgba(255,107,157,0.4)]
                      group cursor-pointer
                    `}
                  >
                    <span className={`text-4xl transition-transform group-hover:scale-125 ${!isOpened ? 'animate-bounce' : ''}`}>
                      {reward.icon}
                    </span>
                    {!isOpened && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6b9d] rounded-full animate-ping" />
                    )}
                    {isOpened && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#6b9a6b] rounded-full flex items-center justify-center">
                        <span className="text-[8px] text-white">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <footer className="mt-16 text-center">
          <div className="flex justify-center items-center gap-3">
            <span className="text-[#ff6b9d]/50 text-sm">✦</span>
            <span className="text-[#d4a5b5]/50 text-xs">made by daniel</span>
            <span className="text-[#ff6b9d]/50 text-sm">✦</span>
          </div>
        </footer>
      </div>

      {/* Reward Popup */}
      {selectedReward && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeRewardPopup}
        >
          <div 
            className="bg-linear-to-br from-[#2d1f2d] to-[#1a1118] rounded-3xl border border-[#ff6b9d]/30 
              p-8 max-w-md w-full shadow-[0_0_60px_rgba(255,107,157,0.3)] animate-[scaleIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <button
                onClick={closeRewardPopup}
                className="absolute top-4 right-4 text-[#d4a5b5] hover:text-[#ff6b9d] 
                  transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full
                  hover:bg-[#ff6b9d]/10"
              >
                ✕
              </button>
              
              <div className="text-6xl mb-4">{selectedReward.icon}</div>
              <h3 className="text-xl text-[#f5e6e8] font-light mb-2">{selectedReward.label}</h3>
              <p className="text-[#d4a5b5] text-sm mb-6">{selectedReward.description}</p>
              
              <div className="gradient-border p-0.5 rounded-lg">
                {selectedReward.type === 'link' ? (
                  <a
                    href={selectedReward.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#ff6b9d] hover:text-[#ffb6c1] font-mono text-sm 
                      bg-[#1a1118] px-4 py-3 rounded-lg transition-colors"
                  >
                    {selectedReward.content}
                  </a>
                ) : (
                  <p className="text-[#f5e6e8] font-mono text-sm bg-[#1a1118] px-4 py-3 rounded-lg select-all">
                    {selectedReward.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
