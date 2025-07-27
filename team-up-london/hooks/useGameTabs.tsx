import { useState } from 'react';
import { TabType } from '../components/GameTabNavigation';
import GameWithDistanceAndRegion from '../interfaces/GameWithDistanceAndRegion';
import Player from '../interfaces/Player';

interface UseGameTabsProps {
  forYouSortedGames: GameWithDistanceAndRegion[];
  nearYouSortedGames: GameWithDistanceAndRegion[];
  trySomethingNewSortedGames: GameWithDistanceAndRegion[];
  playersByGame: Record<string, Player[]>;
  applyAllFilters: (
    games: GameWithDistanceAndRegion[],
    playersByGame: Record<string, Player[]>
  ) => GameWithDistanceAndRegion[];
}

export default function useGameTabs({
  forYouSortedGames,
  nearYouSortedGames,
  trySomethingNewSortedGames,
  playersByGame,
  applyAllFilters,
}: UseGameTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('forYou');

  const getCurrentGames = () => {
    switch (activeTab) {
      case 'forYou':
        return applyAllFilters(forYouSortedGames, playersByGame);
      case 'nearYou':
        return applyAllFilters(nearYouSortedGames, playersByGame);
      case 'trySomethingNew':
        return applyAllFilters(trySomethingNewSortedGames, playersByGame);
      default:
        return [];
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'forYou':
        return 'For You';
      case 'nearYou':
        return 'Near You';
      case 'trySomethingNew':
        return 'Try Something New';
      default:
        return '';
    }
  };

  return {
    activeTab,
    setActiveTab,
    getCurrentGames,
    getTabTitle,
  };
}
