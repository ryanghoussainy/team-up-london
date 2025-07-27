import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import Fonts from '../config/Fonts';
import { Feather } from '@expo/vector-icons';
import useGamesDiscoverySections from '../hooks/useGamesDiscoverySections';
import useSports from '../hooks/useSports';
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

type GamesNavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

type TabType = 'forYou' | 'nearYou' | 'trySomethingNew';

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

  // Open/close
  const toggleSearch = () => {
    if (!searchActive) {
      setSearchActive(true);
      Animated.timing(searchWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(searchWidth, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setSearchActive(false);
        setSearchQuery('');
      });
    }
  };

  const interpolatedWidth = searchWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '52%'],
  });

  const screenWidth = Dimensions.get('window').width;
  const maxSearchWidth = screenWidth * 0.3;

  const interpolatedFilterShift = searchWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -maxSearchWidth * 0.1], // shift left as much as search bar expands
  });

  // Tab navigation animation
  const tabTranslateX = useRef(new Animated.Value(0)).current;

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    let toValue = 0;
    const tabWidth = (screenWidth - 16) / 3; // Assuming equal width tabs

    if (tab === 'forYou') toValue = 0;
    else if (tab === 'nearYou')
      toValue = tabWidth - 8; // Account for container padding
    else if (tab === 'trySomethingNew') toValue = tabWidth * 2 - 16;

    Animated.spring(tabTranslateX, {
      toValue,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container}>
        <Logo />
        <View
          style={[
            styles.sideBySide,
            {
              marginLeft: 24,
              marginBottom: 4,
              justifyContent: 'flex-end',
              alignItems: 'center',
            },
          ]}
        >
          <Text
            style={[
              styles.subTitle,
              {
                marginTop: 12,
                marginRight: 60,
                zIndex: 0,
                position: 'relative',
              },
            ]}
          >
            Discovery
          </Text>
          {/* Group everything inside one row */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Filter button */}
            <Animated.View
              style={{ transform: [{ translateX: interpolatedFilterShift }] }}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    marginLeft: 0,
                    height: 50,
                    width: 100,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                onPress={openFilterModal}
              >
                <Feather name="filter" size={24} color={Colours.primary} />
                <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>
                  Filter
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Search bar */}
            <Animated.View
              style={[
                styles.animatedSearchContainer,
                { width: interpolatedWidth, marginLeft: 2 },
              ]}
            >
              <TextInput
                placeholder="Search..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                autoFocus={searchActive}
              />
            </Animated.View>

            {/* Search icon */}
            <TouchableOpacity
              onPress={toggleSearch}
              style={[styles.searchButton, { marginLeft: 2 }]}
            >
              <Feather
                name={searchActive ? 'x' : 'search'}
                size={24}
                color={Colours.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { marginTop: 15 }]}>
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [{ translateX: tabTranslateX }],
              },
            ]}
          />
          <TouchableOpacity
            style={styles.tab}
            onPress={() => switchTab('forYou')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'forYou' && styles.activeTabText,
              ]}
            >
              For You
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => switchTab('nearYou')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'nearYou' && styles.activeTabText,
              ]}
            >
              Near You
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => switchTab('trySomethingNew')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'trySomethingNew' && styles.activeTabText,
              ]}
            >
              Try New
            </Text>
          </TouchableOpacity>
        </View>

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
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Fonts.main,
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'center',
  },
  sideBySide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  // New tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    zIndex: 2, // Ensure text appears above the sliding indicator
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.main,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    width: '100%',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
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
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
    fontFamily: Fonts.main,
  },
  animatedSearchContainer: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  searchButton: {
    padding: 12,
    backgroundColor: Colours.extraButtons,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: Colours.primary,
    marginRight: 8,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: `${100 / 3}%`, // One third of the container
    height: '100%',
    backgroundColor: Colours.primary,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
});
