import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Player from '../interfaces/Player';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import usePlayerCommunities from '../hooks/usePlayerCommunities';
import Logo from '../components/Logo';
import GameWithDistanceAndRegion from '../interfaces/GameWithDistanceAndRegion';
import useGameFilters from '../hooks/useGameFilters';
import GameFilterModal from '../components/GameFilterModal';
import GameSearchFilterHeader from '../components/GameSearchFilterHeader';
import GameTabNavigation from '../components/GameTabNavigation';
import GamesContent from '../components/GamesContent';
import CreateGameButton from '../components/CreateGameButton';
import useGamesDiscoveryData from '../hooks/useGamesDiscoveryData';
import useGameTabs from '../hooks/useGameTabs';

type GamesNavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function GamesDiscoveryScreen({ player }: { player: Player }) {
  const navigation = useNavigation<GamesNavProp>();
  const { communityIds } = usePlayerCommunities(player.id);

  // Get all games data with a single hook
  const {
    forYouSortedGames,
    nearYouSortedGames,
    trySomethingNewSortedGames,
    playersByGame,
    gamePlayers,
  } = useGamesDiscoveryData(player.id);

  // Game filters
  const {
    searchQuery,
    setSearchQuery,
    tempSkillFilter,
    setTempSkillFilter,
    tempLocationFilter,
    setTempLocationFilter,
    tempSelectedDate,
    setTempSelectedDate,
    tempSelectedSportIds,
    showFilterModal,
    setShowFilterModal,
    applyAllFilters,
    handleApplyFilters,
    openFilterModal,
    toggleSportSelection,
  } = useGameFilters();

  // Tab management
  const { activeTab, setActiveTab, getCurrentGames, getTabTitle } = useGameTabs(
    {
      forYouSortedGames,
      nearYouSortedGames,
      trySomethingNewSortedGames,
      playersByGame,
      applyAllFilters,
    }
  );

  // Navigation handlers
  const handleGamePress = (game: GameWithDistanceAndRegion) => {
    navigation.navigate('Game', {
      game: game.game,
      distance: game.distance,
      mapRegion: game.mapRegion,
    });
  };

  const handleCreateGame = () => {
    navigation.navigate('CreateGame', { communityId: null });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Logo />

        <GameSearchFilterHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onFilterPress={openFilterModal}
        />

        <GameTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <GamesContent
          title={getTabTitle()}
          games={getCurrentGames()}
          player={player}
          playersByGame={playersByGame}
          communityIds={communityIds}
          gamePlayers={gamePlayers}
          onGamePress={handleGamePress}
        />

        <GameFilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
          tempSkillFilter={tempSkillFilter}
          setTempSkillFilter={setTempSkillFilter}
          tempLocationFilter={tempLocationFilter}
          setTempLocationFilter={setTempLocationFilter}
          tempSelectedDate={tempSelectedDate}
          setTempSelectedDate={setTempSelectedDate}
          tempSelectedSportIds={tempSelectedSportIds}
          toggleSportSelection={toggleSportSelection}
        />
      </ScrollView>

      <CreateGameButton onPress={handleCreateGame} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});
