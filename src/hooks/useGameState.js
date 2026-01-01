import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'narrative-unlock-state';

const initialState = {
  isGloballyUnlocked: false,
  completedNodes: [],
  openedRewards: [], // Track which rewards have been opened (for visual effect)
  celebrationSeen: false, // Track if celebration has been shown
};

export function useGameState() {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...initialState, ...JSON.parse(stored) };
      }
    } catch {
      console.warn('Failed to load state from localStorage');
    }
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      console.warn('Failed to save state to localStorage');
    }
  }, [state]);

  const unlockGlobal = useCallback(() => {
    setState(prev => ({ ...prev, isGloballyUnlocked: true }));
  }, []);

  const completeNode = useCallback((nodeId) => {
    setState(prev => ({
      ...prev,
      completedNodes: prev.completedNodes.includes(nodeId)
        ? prev.completedNodes
        : [...prev.completedNodes, nodeId],
    }));
  }, []);

  const markRewardOpened = useCallback((rewardId) => {
    setState(prev => ({
      ...prev,
      openedRewards: prev.openedRewards.includes(rewardId)
        ? prev.openedRewards
        : [...prev.openedRewards, rewardId],
    }));
  }, []);

  const markCelebrationSeen = useCallback(() => {
    setState(prev => ({ ...prev, celebrationSeen: true }));
  }, []);

  const isNodeCompleted = useCallback((nodeId) => {
    return state.completedNodes.includes(nodeId);
  }, [state.completedNodes]);

  const isRewardOpened = useCallback((rewardId) => {
    return state.openedRewards.includes(rewardId);
  }, [state.openedRewards]);

  return {
    state,
    unlockGlobal,
    completeNode,
    markRewardOpened,
    markCelebrationSeen,
    isNodeCompleted,
    isRewardOpened,
  };
}
