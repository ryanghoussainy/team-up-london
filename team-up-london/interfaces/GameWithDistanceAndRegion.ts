import { Region } from 'react-native-maps';
import Game from './Game';
import Distance from './Distance';

export default interface GameWithDistanceAndRegion {
  game: Game;
  distance: Distance | null;
  mapRegion: Region | null;
}
