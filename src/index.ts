import connectToScorebot from './endpoints/connectToScorebot'
import getMatch from './endpoints/getMatch'
import getMatches from './endpoints/getMatches'
import getMatchesStats from './endpoints/getMatchesStats'
import getMatchMapStats from './endpoints/getMatchMapStats'
import getRecentThreads from './endpoints/getRecentThreads'
import getResults from './endpoints/getResults'
import getStreams from './endpoints/getStreams'
import getTeamRanking from './endpoints/getTeamRanking'
import getTeam from './endpoints/getTeam'
import getTeamStats from './endpoints/getTeamStats'
import getPlayer from './endpoints/getPlayer'

const HLTV = {
    connectToScorebot,
    getMatch,
    getMatches,
    getMatchesStats,
    getMatchMapStats,
    getRecentThreads,
    getResults,
    getStreams,
    getTeamRanking,
    getTeam,
    getTeamStats,
    getPlayer
}

export default HLTV
export { HLTV }

// External data types
import FullMatch from './models/FullMatch'
import FullMatchMapStats from './models/FullMatchMapStats'
import FullStream from './models/FullStream'
import LiveMatch from './models/LiveMatch'
import LogUpdate from './models/LogUpdate'
import ScoreboardUpdate from './models/ScoreboardUpdate'
import TeamRanking from './models/TeamRanking'
import UpcomingMatch from './models/UpcomingMatch'
import MatchResult from './models/MatchResult'
import MatchStats from './models/MatchStats'
import MatchType from './enums/MatchType'
import Thread from './models/Thread'
import Map from './enums/Map'
import FullTeam from './models/FullTeam'
import FullTeamStats from './models/FullTeamStats'
import FullPlayer from './models/FullPlayer'
export {
    FullMatch, FullMatchMapStats, Map, FullStream, LiveMatch,
    LogUpdate, ScoreboardUpdate, TeamRanking, UpcomingMatch,
    MatchResult, MatchStats, MatchType, Thread, FullTeam, FullTeamStats,
    FullPlayer
}
