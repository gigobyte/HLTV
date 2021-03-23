import { defaultConfig, defaultLoadPage, HLTVConfig } from './config'
import { getMatch } from './endpoints/getMatch'
import { connectToScorebot } from './endpoints/connectToScorebot'
import { getMatches } from './endpoints/getMatches'
import { getEvent } from './endpoints/getEvent'
import { getEventByName } from './endpoints/getEventByName'
import { getEvents } from './endpoints/getEvents'
import { getMatchMapStats } from './endpoints/getMatchMapStats'
import { getMatchStats } from './endpoints/getMatchStats'
import { getMatchesStats } from './endpoints/getMatchesStats'

export class Hltv {
  constructor(private config: Partial<HLTVConfig> = {}) {
    if (config.httpAgent && !config.loadPage) {
      config.loadPage = defaultLoadPage(config.httpAgent)
    }

    if (!config.httpAgent) {
      config.httpAgent = defaultConfig.httpAgent
    }

    if (!config.loadPage) {
      config.loadPage = defaultConfig.loadPage
    }
  }

  getMatch = getMatch(this.config as HLTVConfig)
  getMatches = getMatches(this.config as HLTVConfig)
  getEvent = getEvent(this.config as HLTVConfig)
  getEvents = getEvents(this.config as HLTVConfig)
  getEventByName = getEventByName(this.config as HLTVConfig)
  getMatchMapStats = getMatchMapStats(this.config as HLTVConfig)
  getMatchStats = getMatchStats(this.config as HLTVConfig)
  getMatchesStats = getMatchesStats(this.config as HLTVConfig)
  connectToScorebot = connectToScorebot(this.config as HLTVConfig)

  public createInstance(config: HLTVConfig) {
    return new Hltv(config)
  }
}

const hltv = new Hltv()

export default hltv
export { hltv as HLTV }

export { MatchStatus } from './endpoints/getMatch'
export type {
  Demo,
  Highlight,
  Veto,
  HeadToHeadResult,
  ProviderOdds,
  MapHalfResult,
  MapResult,
  Stream,
  FullMatch as Match
} from './endpoints/getMatch'

export { MatchEventType, MatchFilter } from './endpoints/getMatches'
export type { MatchPreview, GetMatchesArguments } from './endpoints/getMatches'

export { WinType } from './endpoints/connectToScorebot'
export type { ScoreboardUpdate, LogUpdate } from './endpoints/connectToScorebot'

export type {
  FullEvent,
  FullEventArticle,
  FullEventHighlight,
  FullEventFormat,
  FullEventPrizeDistribution,
  FullEventTeam
} from './endpoints/getEvent'

export { EventType } from './endpoints/getEvents'
export type { EventPreview } from './endpoints/getEvents'

export type { FullMatchStats } from './endpoints/getMatchStats'

export { RankingFilter, MatchType } from './endpoints/getMatchesStats'
export type {
  GetMatchesStatsArguments,
  MatchStatsPreview
} from './endpoints/getMatchesStats'
