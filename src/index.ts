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
import getEvent from './endpoints/getEvent'
import HLTVConfig from './models/HLTVConfig'

export class HLTVFactory {
    constructor(private readonly config: HLTVConfig) {}

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
    getEvent = getEvent(this.config)

    public createInstance(config: HLTVConfig) {
        return new HLTVFactory(config)
    }
}

const hltvInstance = new HLTVFactory(configDefaults)

export default hltvInstance
export { hltvInstance as HLTV }