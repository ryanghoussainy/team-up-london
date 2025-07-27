import { Region } from "react-native-maps";
import Game from "./Game";

export default interface GameWithDistanceAndRegion {
    game: Game;
    distance: { km: number; miles: number };
    mapRegion: Region;
}
