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
import { getPlayer } from './endpoints/getPlayer'
import { getPlayerByName } from './endpoints/getPlayerByName'
import { getPlayerRanking } from './endpoints/getPlayerRanking'
import { getPlayerStats } from './endpoints/getPlayerStats'
import { getRecentThreads } from './endpoints/getRecentThreads'
import { getStreams } from './endpoints/getStreams'

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
  getPlayer = getPlayer(this.config as HLTVConfig)
  getPlayerByName = getPlayerByName(this.config as HLTVConfig)
  getPlayerRanking = getPlayerRanking(this.config as HLTVConfig)
  getPlayerStats = getPlayerStats(this.config as HLTVConfig)
  getRecentThreads = getRecentThreads(this.config as HLTVConfig)
  getStreams = getStreams(this.config as HLTVConfig)
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
  FullEventHighlight,
  FullEventFormat,
  FullEventPrizeDistribution,
  FullEventTeam
} from './endpoints/getEvent'

export { EventType } from './endpoints/getEvents'
export type { EventPreview } from './endpoints/getEvents'

export type { FullMatchStats } from './endpoints/getMatchStats'

export type {
  GetMatchesStatsArguments,
  MatchStatsPreview
} from './endpoints/getMatchesStats'

export type {
  FullPlayerTeam,
  PlayerAchievement,
  FullPlayer
} from './endpoints/getPlayer'

export type {
  PlayerRanking,
  GetPlayerRankingOptions
} from './endpoints/getPlayerRanking'

export type {
  FullPlayerStats,
  GetPlayerStatsArguments
} from './endpoints/getPlayerStats'

export { ThreadCategory } from './endpoints/getRecentThreads'
export type { Thread } from './endpoints/getRecentThreads'

export { StreamCategory } from './endpoints/getStreams'
export type { FullStream } from './endpoints/getStreams'

export { GameMap } from './shared/GameMap'
export { MatchFormat } from './shared/MatchFormat'
export { RankingFilter } from './shared/RankingFilter'
export { MatchType } from './shared/MatchType'
export { BestOfFilter } from './shared/BestOfFilter'
export type { Article } from './shared/Article'
export type { Country } from './shared/Country'
export type { Event } from './shared/Event'
export type { Player } from './shared/Player'
export type { Team } from './shared/Team'
