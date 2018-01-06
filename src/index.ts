import * as configDefaults from './utils/constants';
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
import HLTVConfig from './models/HLTVConfig'

export class HLTVFactory {
    constructor(private config: HLTVConfig) {}

    connectToScorebot = connectToScorebot(this.config)
    getMatch = getMatch(this.config)
    getMatches = getMatches(this.config)
    getMatchesStats = getMatchesStats(this.config)
    getMatchMapStats = getMatchMapStats(this.config)
    getRecentThreads = getRecentThreads(this.config)
    getResults = getResults(this.config)
    getStreams = getStreams(this.config)
    getTeamRanking = getTeamRanking(this.config)
    getTeam = getTeam(this.config)
    getTeamStats = getTeamStats(this.config)
    getPlayer = getPlayer(this.config)

    public createInstance(config: HLTVConfig) {
        return new HLTVFactory(config)
    }
}

const hltvInstance = new HLTVFactory(configDefaults)

export default hltvInstance
export { hltvInstance as HLTV }

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
