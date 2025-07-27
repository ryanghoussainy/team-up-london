import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import Fonts from '../config/Fonts';
import { Feather } from '@expo/vector-icons';
import useGamesDiscoverySections from '../hooks/useGamesDiscoverySections';
import GameCard from '../components/GameCard';
import { AVERAGE_SKILL_LEVEL } from '../constants/averageSkillLevel';
import { getPlayersInGame } from '../operations/Games';
import Player from '../interfaces/Player';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import Colours from '../config/Colours';
import useDistancesAndRegions from '../hooks/useDistancesAndRegions';
import usePlayerCommunities from '../hooks/usePlayerCommunities';
import Logo from '../components/Logo';
import GameWithDistanceAndRegion from '../interfaces/GameWithDistanceAndRegion';
import useGameFilters from '../hooks/useGameFilters';
import GameFilterModal from '../components/GameFilterModal';
import GameSearchFilterHeader from '../components/GameSearchFilterHeader';
import GameTabNavigation, { TabType } from '../components/GameTabNavigation';

type GamesNavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function GamesDiscoveryScreen({ player }: { player: Player }) {
  const navigation = useNavigation<GamesNavProp>();
  const { communityIds } = usePlayerCommunities(player.id);

  const { forYouGames, nearYouGames, trySomethingNewGames, gamePlayers } =
    useGamesDiscoverySections(player.id);

  const { distances: forYouDistances, mapRegions: forYouMapRegions } =
    useDistancesAndRegions(forYouGames);
  const { distances: nearYouDistances, mapRegions: nearYouMapRegions } =
    useDistancesAndRegions(nearYouGames);
  const {
    distances: trySomethingNewDistances,
    mapRegions: trySomethingNewMapRegions,
  } = useDistancesAndRegions(trySomethingNewGames);

  // States for sorted games by distance
  const [forYouSortedGames, setForYouSortedGames] = useState<
    GameWithDistanceAndRegion[]
  >([]);
  const [nearYouSortedGames, setNearYouSortedGames] = useState<
    GameWithDistanceAndRegion[]
  >([]);
  const [trySomethingNewSortedGames, setTrySomethingNewSortedGames] = useState<
    GameWithDistanceAndRegion[]
  >([]);

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('forYou');

  useEffect(() => {
    // Combine games with their distances and regions
    setForYouSortedGames(
      forYouGames
        .map((game, idx) => ({
          game,
          distance: forYouDistances[idx],
          mapRegion: forYouMapRegions[idx],
        }))
        .sort(
          (a, b) => (a.distance || { km: 0 }).km - (b.distance || { km: 0 }).km
        )
    );

    setNearYouSortedGames(
      nearYouGames
        .map((game, idx) => ({
          game,
          distance: nearYouDistances[idx],
          mapRegion: nearYouMapRegions[idx],
        }))
        .sort(
          (a, b) => (a.distance || { km: 0 }).km - (b.distance || { km: 0 }).km
        )
    );

    setTrySomethingNewSortedGames(
      trySomethingNewGames
        .map((game, idx) => ({
          game,
          distance: trySomethingNewDistances[idx],
          mapRegion: trySomethingNewMapRegions[idx],
        }))
        .sort(
          (a, b) => (a.distance || { km: 0 }).km - (b.distance || { km: 0 }).km
        )
    );
  }, [
    forYouGames,
    forYouDistances,
    forYouMapRegions,
    nearYouGames,
    nearYouDistances,
    nearYouMapRegions,
    trySomethingNewGames,
    trySomethingNewDistances,
    trySomethingNewMapRegions,
  ]);

  // Players cache keyed by game id
  const [playersByGame, setPlayersByGame] = useState<Record<string, Player[]>>(
    {}
  );

  useEffect(() => {
    const fetchPlayers = async () => {
      // Collect all unique game IDs across the three sections
      const allGames = [
        ...forYouGames,
        ...nearYouGames,
        ...trySomethingNewGames,
      ];
      const uniqueIds = Array.from(new Set(allGames.map((g) => g.id)));

      const entries = await Promise.all(
        uniqueIds.map(
          async (id) => [id, await getPlayersInGame(id)] as [string, Player[]]
        )
      );

      setPlayersByGame(Object.fromEntries(entries));
    };

    fetchPlayers();
  }, [forYouGames, nearYouGames, trySomethingNewGames]);

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

  // Search (+ animation)
  const [searchActive, setSearchActive] = useState(false);
  const searchWidth = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container}>
        <Logo />

        <GameSearchFilterHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          searchWidth={searchWidth}
          onFilterPress={openFilterModal}
        />

        <GameTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Games Content */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>{getTabTitle()}</Text>
          <View style={styles.gamesContainer}>
            {getCurrentGames().map((game, idx) => {
              const players = playersByGame[game.game.id] || [];
              const avgSkillLevel = AVERAGE_SKILL_LEVEL(
                players,
                game.game.sport_id
              );

              return (
                <GameCard
                  key={idx}
                  player={player}
                  game={game.game}
                  onPress={() =>
                    navigation.navigate('Game', {
                      game: game.game,
                      distance: game.distance,
                      mapRegion: game.mapRegion,
                    })
                  }
                  distance={game.distance}
                  isCommunityMember={communityIds.includes(
                    game.game.community_id || ''
                  )}
                  numPlayers={gamePlayers.get(game.game.id)?.length || 0}
                  averageSkillLevel={avgSkillLevel}
                />
              );
            })}
            {getCurrentGames().length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No games found</Text>
              </View>
            )}
          </View>
        </View>

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

      {/* Create Game Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: Colours.primary,
            borderColor: Colours.highlightButton,
            borderWidth: 0,
            position: 'absolute',
            bottom: 20,
            width: '90%',
            alignSelf: 'center',
            paddingVertical: 12,
            flexDirection: 'row',
          },
        ]}
        onPress={() => navigation.navigate('CreateGame', { communityId: null })}
      >
        <Feather name="plus" size={24} color={Colours.success} />
        <Text
          style={[styles.buttonText, { fontWeight: 'bold', color: 'white' }]}
        >
          Create Game
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  contentSection: {
    flex: 1,
    marginBottom: 80, // Space for create game button
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.main,
    marginBottom: 16,
    color: Colours.primary,
  },
  gamesContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: Fonts.main,
    color: '#666',
  },
  button: {
    backgroundColor: Colours.extraButtons,
    outlineColor: Colours.primary,
    borderWidth: 0,
    borderColor: Colours.primary,
    padding: 10,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.main,
    marginLeft: 8,
  },
});
