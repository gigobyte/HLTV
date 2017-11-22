import Team from './Team';
import Event from './Event';
import Player from './Player';
import MapSlug from '../enums/MapSlug';
import WeakRoundOutcome, { Outcome } from './RoundOutcome';
export interface RoundOutcome extends WeakRoundOutcome {
    outcome: Outcome;
}
export interface PlayerStat extends Player {
    readonly value: number;
}
export interface TeamStatComparison {
    readonly team1: number;
    readonly team2: number;
}
export interface MatchStatsOverview {
    readonly rating: TeamStatComparison;
    readonly firstKills: TeamStatComparison;
    readonly clutchesWon: TeamStatComparison;
    readonly mostKills: PlayerStat;
    readonly mostDamage: PlayerStat;
    readonly mostAssists: PlayerStat;
    readonly mostAWPKills: PlayerStat;
    readonly mostFirstKills: PlayerStat;
    readonly bestRating: PlayerStat;
}
export interface PlayerOverviewStats {
    kills: number;
    hsKills: number;
    assists: number;
    deaths: number;
    KAST: number;
    killDeathsDifference: number;
    ADR: number;
    firstKillsDifference: number;
    rating: number;
}
export interface PlayerPerformanceStats {
    killsPerRound: number;
    deathsPerRound: number;
    impact: number;
}
export interface PlayerStats extends Player, PlayerPerformanceStats, PlayerOverviewStats {
}
export interface TeamPerformance {
    kills: number;
    deaths: number;
    assists: number;
}
export interface PerformanceOverview {
    readonly team1: TeamPerformance;
    readonly team2: TeamPerformance;
}
interface FullMatchMapStats {
    readonly matchPageID: number;
    readonly team1: Team;
    readonly team2: Team;
    readonly event: Event;
    readonly map: MapSlug;
    readonly date: number;
    readonly overview: MatchStatsOverview;
    readonly roundHistory: RoundOutcome[];
    readonly playerStats: {
        readonly team1: PlayerStats[];
        readonly team2: PlayerStats[];
    };
    readonly performanceOverview: PerformanceOverview;
}
export default FullMatchMapStats;
