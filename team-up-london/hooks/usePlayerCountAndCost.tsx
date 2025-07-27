import { useState } from 'react';

export default function usePlayerCountAndCost() {
  const [maxPlayers, setMaxPlayers] = useState<number | null>(null);
  const [minPlayers, setMinPlayers] = useState<number | null>(null);
  const [cost, setCost] = useState<number>(0);

  const handleMinPlayersChange = (text: string) => {
    const num = parseInt(text, 10);
    setMinPlayers(isNaN(num) ? null : num);
  };

  const handleMaxPlayersChange = (text: string) => {
    const num = parseInt(text, 10);
    setMaxPlayers(isNaN(num) ? null : num);
  };

  const adjustMinPlayers = (increment: boolean) => {
    if (increment) {
      setMinPlayers((prev) => (prev || 0) + 1);
    } else {
      setMinPlayers((prev) => Math.max(0, (prev || 0) - 1));
    }
  };

  const adjustMaxPlayers = (increment: boolean) => {
    if (increment) {
      setMaxPlayers((prev) => (prev || 0) + 1);
    } else {
      setMaxPlayers((prev) => Math.max(0, (prev || 0) - 1));
    }
  };

  const handleCostChange = (text: string) => {
    const num = parseFloat(text);
    setCost(isNaN(num) ? 0 : num);
  };

  return {
    maxPlayers,
    minPlayers,
    cost,
    handleMinPlayersChange,
    handleMaxPlayersChange,
    adjustMinPlayers,
    adjustMaxPlayers,
    handleCostChange,
  };
}
