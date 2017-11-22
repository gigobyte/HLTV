import Player from './Player';
import Event from './Event';
import MapSlug from '../enums/MapSlug';
import Team from './Team';
export interface TeamStatsMatch {
    dateApproximate: number;
    event: Event;
    enemyTeam: Team;
    map: MapSlug;
    result: string;
}
export interface TeamMapStats {
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
    totalRounds: number;
    roundWinPAfterFirstKill: number;
    roundWinPAfterFirstDeath: number;
}
export interface TeamStatsEvent {
    place: string;
    event: Event;
}
interface FullTeamStats {
    overview: {
        mapsPlayed: number;
        wins: number;
        draws: number;
        losses: number;
        totalKills: number;
        totalDeaths: number;
        roundsPlayed: number;
        kdRatio: number;
    };
    currentLineup: Player[];
    historicPlayers: Player[];
    standins: Player[];
    matches: TeamStatsMatch[];
    mapStats: {
        [key: string]: TeamMapStats;
    };
    events: TeamStatsEvent[];
}
export default FullTeamStats;
