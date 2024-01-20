import {
  defaultConfig,
  defaultLoadMatchStatsPage,
  defaultLoadPage,
  type HLTVConfig
} from './config.js'
import { getMatch } from './endpoints/getMatch.js'
import { connectToScorebot } from './endpoints/connectToScorebot.js'
import { getMatches } from './endpoints/getMatches.js'
import { getEvent } from './endpoints/getEvent.js'
import { getEventByName } from './endpoints/getEventByName.js'
import { getEvents } from './endpoints/getEvents.js'
import { getMatchMapStats } from './endpoints/getMatchMapStats.js'
import { getMatchStats } from './endpoints/getMatchStats.js'
import { getMatchesStats } from './endpoints/getMatchesStats.js'
import { getPlayer } from './endpoints/getPlayer.js'
import { getPlayerByName } from './endpoints/getPlayerByName.js'
import { getPlayerRanking } from './endpoints/getPlayerRanking.js'
import { getPlayerStats } from './endpoints/getPlayerStats.js'
import { getRecentThreads } from './endpoints/getRecentThreads.js'
import { getStreams } from './endpoints/getStreams.js'
import { getTeam } from './endpoints/getTeam.js'
import { getTeamByName } from './endpoints/getTeamByName.js'
import { getTeamRanking } from './endpoints/getTeamRanking.js'
import { getTeamStats } from './endpoints/getTeamStats.js'
import { getPastEvents } from './endpoints/getPastEvents.js'
import { getResults } from './endpoints/getResults.js'
import { getNews } from './endpoints/getNews.js'
import { getDetailedTeamMapStats } from './endpoints/getDetailedTeamMapStats.js'

export class Hltv {
  private config: Partial<HLTVConfig> = {}
  constructor(config?: Partial<HLTVConfig>) {
    if (config) this.config = config

    if (!this.config.httpAgent) {
      this.config.httpAgent = defaultConfig.httpAgent
    }

    this.config.loadMatchStatsPage ??= defaultLoadMatchStatsPage

    if (this.config.httpAgent && !this.config.loadPage) {
      this.config.loadPage = defaultLoadPage(this.config.httpAgent)
    }

    if (!this.config.loadPage) {
      this.config.loadPage = defaultConfig.loadPage
    }

    this.getMatch = getMatch(this.config as HLTVConfig)
    this.getMatches = getMatches(this.config as HLTVConfig)
    this.getEvent = getEvent(this.config as HLTVConfig)
    this.getEvents = getEvents(this.config as HLTVConfig)
    this.getPastEvents = getPastEvents(this.config as HLTVConfig)
    this.getEventByName = getEventByName(this.config as HLTVConfig)
    this.getMatchMapStats = getMatchMapStats(this.config as HLTVConfig)
    this.getMatchStats = getMatchStats(this.config as HLTVConfig)
    this.getMatchesStats = getMatchesStats(this.config as HLTVConfig)
    this.getPlayer = getPlayer(this.config as HLTVConfig)
    this.getPlayerByName = getPlayerByName(this.config as HLTVConfig)
    this.getPlayerRanking = getPlayerRanking(this.config as HLTVConfig)
    this.getPlayerStats = getPlayerStats(this.config as HLTVConfig)
    this.getRecentThreads = getRecentThreads(this.config as HLTVConfig)
    this.getStreams = getStreams(this.config as HLTVConfig)
    this.getTeam = getTeam(this.config as HLTVConfig)
    this.getTeamByName = getTeamByName(this.config as HLTVConfig)
    this.getTeamRanking = getTeamRanking(this.config as HLTVConfig)
    this.getTeamStats = getTeamStats(this.config as HLTVConfig)
    this.getResults = getResults(this.config as HLTVConfig)
    this.getNews = getNews(this.config as HLTVConfig)
    this.connectToScorebot = connectToScorebot(this.config as HLTVConfig)
    this.getDetailedTeamMapStats = getDetailedTeamMapStats(
      this.config as HLTVConfig
    )
  }

  getMatch = getMatch(this.config as HLTVConfig)
  getMatches = getMatches(this.config as HLTVConfig)
  getEvent = getEvent(this.config as HLTVConfig)
  getEvents = getEvents(this.config as HLTVConfig)
  getPastEvents = getPastEvents(this.config as HLTVConfig)
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
  getTeam = getTeam(this.config as HLTVConfig)
  getTeamByName = getTeamByName(this.config as HLTVConfig)
  getTeamRanking = getTeamRanking(this.config as HLTVConfig)
  getTeamStats = getTeamStats(this.config as HLTVConfig)
  getResults = getResults(this.config as HLTVConfig)
  getNews = getNews(this.config as HLTVConfig)
  connectToScorebot = connectToScorebot(this.config as HLTVConfig)
  getDetailedTeamMapStats = getDetailedTeamMapStats(this.config as HLTVConfig)

  public createInstance(config: Partial<HLTVConfig>) {
    return new Hltv(config)
  }

  public TEAM_PLACEHOLDER_IMAGE =
    'https://www.hltv.org/img/static/team/placeholder.svg'

  public PLAYER_PLACEHOLDER_IMAGE =
    'https://static.hltv.org/images/playerprofile/bodyshot/unknown.png'
}

const hltv = new Hltv()

export default hltv
export { hltv as HLTV }

export { MatchStatus } from './endpoints/getMatch.js'
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
} from './endpoints/getMatch.js'

export { MatchEventType, MatchFilter } from './endpoints/getMatches.js'
export type {
  MatchPreview,
  GetMatchesArguments
} from './endpoints/getMatches.js'

export { WinType } from './endpoints/connectToScorebot.js'
export type {
  ScoreboardUpdate,
  LogUpdate
} from './endpoints/connectToScorebot.js'

export type {
  FullEvent,
  FullEventHighlight,
  FullEventFormat,
  FullEventPrizeDistribution,
  FullEventTeam
} from './endpoints/getEvent.js'

export type { EventPreview, GetEventsArguments } from './endpoints/getEvents.js'

export type { FullMatchStats } from './endpoints/getMatchStats.js'

export type {
  GetMatchesStatsArguments,
  MatchStatsPreview
} from './endpoints/getMatchesStats.js'

export type {
  FullPlayerTeam,
  PlayerAchievement,
  FullPlayer
} from './endpoints/getPlayer.js'

export type {
  PlayerRanking,
  GetPlayerRankingOptions
} from './endpoints/getPlayerRanking.js'

export type {
  FullPlayerStats,
  GetPlayerStatsArguments
} from './endpoints/getPlayerStats.js'

export { ThreadCategory } from './endpoints/getRecentThreads.js'
export type { Thread } from './endpoints/getRecentThreads.js'

export { StreamCategory } from './endpoints/getStreams.js'
export type { FullStream } from './endpoints/getStreams.js'

export { TeamPlayerType } from './endpoints/getTeam.js'
export type { FullTeam, FullTeamPlayer } from './endpoints/getTeam.js'

export type {
  TeamRanking,
  GetTeamArguments
} from './endpoints/getTeamRanking.js'

export type { GetPastEventsArguments } from './endpoints/getPastEvents.js'

export {
  ResultsMatchType,
  ContentFilter,
  GameType
} from './endpoints/getResults.js'
export type {
  FullMatchResult,
  ResultTeam,
  GetResultsArguments
} from './endpoints/getResults.js'

export type { NewsPreview, GetNewsArguments } from './endpoints/getNews.js'

export { GameMap } from './shared/GameMap.js'
export { MatchFormat } from './shared/MatchFormat.js'
export { RankingFilter } from './shared/RankingFilter.js'
export { MatchType } from './shared/MatchType.js'
export { BestOfFilter } from './shared/BestOfFilter.js'
export type { Article } from './shared/Article.js'
export type { Country } from './shared/Country.js'
export type { Event } from './shared/Event.js'
export type { Player } from './shared/Player.js'
export type { Team } from './shared/Team.js'
export type { EventType } from './shared/EventType.js'
