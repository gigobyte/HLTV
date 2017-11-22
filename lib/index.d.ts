declare const HLTV: {
    connectToScorebot: ({id, onScoreboardUpdate, onLogUpdate, onConnect, onDisconnect}: {
        id: number;
        onScoreboardUpdate?: ((data: ScoreboardUpdate) => any) | undefined;
        onLogUpdate?: ((data: LogUpdate) => any) | undefined;
        onConnect?: (() => any) | undefined;
        onDisconnect?: (() => any) | undefined;
    }) => Promise<void>;
    getMatch: ({id}: {
        id: number;
    }) => Promise<FullMatch>;
    getMatches: () => Promise<(UpcomingMatch | LiveMatch)[]>;
    getMatchesStats: ({startDate, endDate, matchType, maps}?: {
        startDate?: string | undefined;
        endDate?: string | undefined;
        matchType?: MatchType | undefined;
        maps?: Map[] | undefined;
    }) => Promise<MatchStats[]>;
    getMatchMapStats: ({id}: {
        id: number;
    }) => Promise<FullMatchMapStats>;
    getRecentThreads: () => Promise<Thread[]>;
    getResults: ({pages}?: {
        pages?: number;
    }) => Promise<MatchResult[]>;
    getStreams: ({loadLinks}?: {
        loadLinks?: boolean | undefined;
    }) => Promise<FullStream[]>;
    getTeamRanking: ({year, month, day}?: {
        year?: string;
        month?: string;
        day?: string;
    }) => Promise<TeamRanking[]>;
    getTeam: ({id}: {
        id: number;
    }) => Promise<FullTeam>;
    getTeamStats: ({id}: {
        id: number;
    }) => Promise<FullTeamStats>;
    getPlayer: ({id}: {
        id: number;
    }) => Promise<FullPlayer>;
};
export default HLTV;
export { HLTV };
import FullMatch from './models/FullMatch';
import FullMatchMapStats from './models/FullMatchMapStats';
import FullStream from './models/FullStream';
import LiveMatch from './models/LiveMatch';
import LogUpdate from './models/LogUpdate';
import ScoreboardUpdate from './models/ScoreboardUpdate';
import TeamRanking from './models/TeamRanking';
import UpcomingMatch from './models/UpcomingMatch';
import MatchResult from './models/MatchResult';
import MatchStats from './models/MatchStats';
import MatchType from './enums/MatchType';
import Thread from './models/Thread';
import Map from './enums/Map';
import FullTeam from './models/FullTeam';
import FullTeamStats from './models/FullTeamStats';
import FullPlayer from './models/FullPlayer';
export { FullMatch, FullMatchMapStats, Map, FullStream, LiveMatch, LogUpdate, ScoreboardUpdate, TeamRanking, UpcomingMatch, MatchResult, MatchStats, MatchType, Thread, FullTeam, FullTeamStats, FullPlayer };
