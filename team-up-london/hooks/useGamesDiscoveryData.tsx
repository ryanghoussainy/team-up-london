import useGamesDiscoverySections from './useGamesDiscoverySections';
import useDistancesAndRegions from './useDistancesAndRegions';
import useGamesWithDistances from './useGamesWithDistances';


export default function useGamesDiscoveryData(
  playerId: string
) {
  // Get initial game sections
  const { forYouGames, nearYouGames, trySomethingNewGames, gamePlayers } =
    useGamesDiscoverySections(playerId);

  // Calculate distances and regions for each section
  const { distances: forYouDistances, mapRegions: forYouMapRegions } =
    useDistancesAndRegions(forYouGames);
  const { distances: nearYouDistances, mapRegions: nearYouMapRegions } =
    useDistancesAndRegions(nearYouGames);
  const {
    distances: trySomethingNewDistances,
    mapRegions: trySomethingNewMapRegions,
  } = useDistancesAndRegions(trySomethingNewGames);

  // Combine games with distances and get players
  const {
    forYouSortedGames,
    nearYouSortedGames,
    trySomethingNewSortedGames,
    playersByGame,
  } = useGamesWithDistances(
    forYouGames,
    nearYouGames,
    trySomethingNewGames,
    forYouDistances,
    nearYouDistances,
    trySomethingNewDistances,
    forYouMapRegions,
    nearYouMapRegions,
    trySomethingNewMapRegions
  );

  return {
    forYouSortedGames,
    nearYouSortedGames,
    trySomethingNewSortedGames,
    playersByGame,
    gamePlayers,
  };
}
