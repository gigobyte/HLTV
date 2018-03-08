/// <reference types="cheerio" />
import 'babel-polyfill';
import Team from '../models/Team';
import Veto from '../models/Veto';
import Player from '../models/Player';
import { MapStatistic } from '../models/FullTeam';
import { WeakRoundOutcome } from '../models/RoundOutcome';
import MapSlug from '../enums/MapSlug';
export declare const fetchPage: (url: string) => Promise<CheerioStatic>;
export declare const toArray: (elements: Cheerio) => Cheerio[];
export declare const getMapSlug: (map: string) => MapSlug;
export declare const mapVetoElementToModel: (el: Cheerio, team1: Team, team2: Team) => Veto;
export declare const getMatchPlayer: (playerEl: Cheerio) => Player;
export declare const getMatchFormatAndMap: (mapText: string) => {
    map?: MapSlug | undefined;
    format: string;
};
export declare const mapRoundElementToModel: () => (el: Cheerio) => WeakRoundOutcome;
export declare const getMapsStatistics: (source: string) => {
    [key: string]: MapStatistic;
} | undefined;
export declare const getTimestamp: (source: string) => number;
