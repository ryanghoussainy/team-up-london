import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GameCard from './GameCard';
import { AVERAGE_SKILL_LEVEL } from '../constants/averageSkillLevel';
import Player from '../interfaces/Player';
import GameWithDistanceAndRegion from '../interfaces/GameWithDistanceAndRegion';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

interface GamesContentProps {
  title: string;
  games: GameWithDistanceAndRegion[];
  player: Player;
  playersByGame: Record<string, Player[]>;
  communityIds: string[];
  gamePlayers: Map<string, Player[]>;
  onGamePress: (game: GameWithDistanceAndRegion) => void;
}

export default function GamesContent({
  title,
  games,
  player,
  playersByGame,
  communityIds,
  gamePlayers,
  onGamePress,
}: GamesContentProps) {
  return (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.gamesContainer}>
        {games.map((game, idx) => {
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
              onPress={() => onGamePress(game)}
              distance={game.distance}
              isCommunityMember={communityIds.includes(
                game.game.community_id || ''
              )}
              numPlayers={gamePlayers.get(game.game.id)?.length || 0}
              averageSkillLevel={avgSkillLevel}
            />
          );
        })}
        {games.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No games found</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
