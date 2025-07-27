import { useState } from 'react';
import GameWithDistanceAndRegion from '../interfaces/GameWithDistanceAndRegion';
import { AVERAGE_SKILL_LEVEL } from '../constants/averageSkillLevel';
import Player from '../interfaces/Player';
import { isSameDay } from 'date-fns';
import { SkillFilter } from '../components/GameFilterModal';

export default function useGameFilters() {
  // Actual filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSportIds, setSelectedSportIds] = useState<string[]>([]);

  // Temporary states for modal (before applying)
  const [tempSkillFilter, setTempSkillFilter] = useState<SkillFilter>('all');
  const [tempLocationFilter, setTempLocationFilter] = useState('');
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
  const [tempSelectedSportIds, setTempSelectedSportIds] = useState<string[]>(
    []
  );

  // Modal state
  const [showFilterModal, setShowFilterModal] = useState(false);

  const applyAllFilters = (
    games: Array<GameWithDistanceAndRegion>,
    playersByGame: Record<string, Player[]>
  ) => {
    return games.filter((gameWithDistanceAndRegion) => {
      const game = gameWithDistanceAndRegion.game;

      // 1. Name search (case-insensitive substring)
      if (!game.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 2. Skill-level filter
      const averageSkillLevel = AVERAGE_SKILL_LEVEL(
        playersByGame[game.id] || [],
        game.sport_id
      );
      if (skillFilter !== 'all' && averageSkillLevel !== skillFilter) {
        return false;
      }

      // 3. Location filter (case-insensitive substring)
      if (
        locationFilter.length > 0 &&
        !game.location.toLowerCase().includes(locationFilter.toLowerCase())
      ) {
        return false;
      }

      // 4. Date filter (if a date is selected, show only games whose start_time falls on that day)
      if (selectedDate) {
        const gameDate = new Date(game.start_time);
        if (!isSameDay(gameDate, selectedDate)) {
          return false;
        }
      }

      // 5. Sports filter (if sports are selected, game must match one of the selected sports)
      if (selectedSportIds.length > 0) {
        if (!selectedSportIds.includes(game.sport_id)) {
          return false;
        }
      }

      return true;
    });
  };

  const handleApplyFilters = () => {
    setSkillFilter(tempSkillFilter);
    setLocationFilter(tempLocationFilter);
    setSelectedDate(tempSelectedDate);
    setSelectedSportIds(tempSelectedSportIds);
    setShowFilterModal(false);
  };

  const openFilterModal = () => {
    // Sync temp values with current values when opening modal
    setTempSkillFilter(skillFilter);
    setTempLocationFilter(locationFilter);
    setTempSelectedDate(selectedDate);
    setTempSelectedSportIds(selectedSportIds);
    setShowFilterModal(true);
  };

  const toggleSportSelection = (sportId: string) => {
    if (tempSelectedSportIds.includes(sportId)) {
      setTempSelectedSportIds(
        tempSelectedSportIds.filter((id) => id !== sportId)
      );
    } else {
      setTempSelectedSportIds([...tempSelectedSportIds, sportId]);
    }
  };

  return {
    // Filter states
    searchQuery,
    setSearchQuery,

    // Temporary states
    tempSkillFilter,
    setTempSkillFilter,
    tempLocationFilter,
    setTempLocationFilter,
    tempSelectedDate,
    setTempSelectedDate,
    tempSelectedSportIds,

    // Modal state
    showFilterModal,
    setShowFilterModal,

    // Functions
    applyAllFilters,
    handleApplyFilters,
    openFilterModal,
    toggleSportSelection,
  };
}
