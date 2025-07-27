import { useState, useEffect } from 'react';
import { getPlayersInGame } from '../operations/Games';
import Player from '../interfaces/Player';
import Game from '../interfaces/Game';
import GameWithDistanceAndRegion from '../interfaces/GameWithDistanceAndRegion';
import Distance from '../interfaces/Distance';
import { Region } from 'react-native-maps';

interface UseGamesWithDistancesReturn {
  forYouSortedGames: GameWithDistanceAndRegion[];
  nearYouSortedGames: GameWithDistanceAndRegion[];
  trySomethingNewSortedGames: GameWithDistanceAndRegion[];
  playersByGame: Record<string, Player[]>;
}

export default function useGamesWithDistances(
  forYouGames: Game[],
  nearYouGames: Game[],
  trySomethingNewGames: Game[],
  forYouDistances: (Distance | null)[],
  nearYouDistances: (Distance | null)[],
  trySomethingNewDistances: (Distance | null)[],
  forYouMapRegions: (Region | null)[],
  nearYouMapRegions: (Region | null)[],
  trySomethingNewMapRegions: (Region | null)[]
): UseGamesWithDistancesReturn {
  const [forYouSortedGames, setForYouSortedGames] = useState<
    GameWithDistanceAndRegion[]
  >([]);
  const [nearYouSortedGames, setNearYouSortedGames] = useState<
    GameWithDistanceAndRegion[]
  >([]);
  const [trySomethingNewSortedGames, setTrySomethingNewSortedGames] = useState<
    GameWithDistanceAndRegion[]
  >([]);
  const [playersByGame, setPlayersByGame] = useState<Record<string, Player[]>>(
    {}
  );

  // Helper function to combine games with distances and sort by distance
  const combineAndSortGames = (
    games: Game[],
    distances: (Distance | null)[],
    mapRegions: (Region | null)[]
  ): GameWithDistanceAndRegion[] => {
    return games
      .map((game, idx) => ({
        game,
        distance: distances[idx],
        mapRegion: mapRegions[idx],
      }))
      .sort(
        (a, b) => (a.distance || { km: 0 }).km - (b.distance || { km: 0 }).km
      );
  };

  // Effect to process and sort games with distances
  useEffect(() => {
    setForYouSortedGames(
      combineAndSortGames(forYouGames, forYouDistances, forYouMapRegions)
    );

    setNearYouSortedGames(
      combineAndSortGames(nearYouGames, nearYouDistances, nearYouMapRegions)
    );

    setTrySomethingNewSortedGames(
      combineAndSortGames(
        trySomethingNewGames,
        trySomethingNewDistances,
        trySomethingNewMapRegions
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

  // Effect to fetch players for all games
  useEffect(() => {
    const fetchPlayers = async () => {
      const allGames = [
        ...forYouGames,
        ...nearYouGames,
        ...trySomethingNewGames,
      ];
      const uniqueIds = Array.from(new Set(allGames.map((g) => g.id)));

      if (uniqueIds.length === 0) {
        setPlayersByGame({});
        return;
      }

      try {
        const entries = await Promise.all(
          uniqueIds.map(
            async (id) => [id, await getPlayersInGame(id)] as [string, Player[]]
          )
        );

        setPlayersByGame(Object.fromEntries(entries));
      } catch (error) {
        console.error('Error fetching players:', error);
        setPlayersByGame({});
      }
    };

    fetchPlayers();
  }, [forYouGames, nearYouGames, trySomethingNewGames]);

  return {
    forYouSortedGames,
    nearYouSortedGames,
    trySomethingNewSortedGames,
    playersByGame,
  };
}
