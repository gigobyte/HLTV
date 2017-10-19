import Team from '../models/Team';
import Veto from '../models/Veto';
import Player from '../models/Player';
import { MapStatistic } from '../models/FullTeam';
import { WeakRoundOutcome } from '../models/RoundOutcome';
import MapSlug from '../enums/MapSlug';
export declare const fetchPage: (url: string) => Promise<any>;
export declare const toArray: (elements: any) => any[];
export declare const getMapSlug: (map: string) => MapSlug;
export declare const mapVetoElementToModel: (el: any, team1: Team, team2: Team) => Veto;
export declare const getMatchPlayer: (playerEl: any) => Player;
export declare const getMatchFormatAndMap: (mapText: string) => {
    map?: MapSlug | undefined;
    format: string;
};
export declare const mapRoundElementToModel: (team1Id: number, team2Id: number) => (el: any, i: number) => WeakRoundOutcome;
export declare const getMapsStatistics: (source: string) => {
    [key: string]: MapStatistic;
} | undefined;
export declare const getTimestamp: (source: string) => number;
