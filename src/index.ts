import { defaultConfig, defaultLoadPage, HLTVConfig } from './config'
import { getMatch } from './endpoints/getMatch'
import { connectToScorebot } from './endpoints/connectToScorebot'
import { getMatches } from './endpoints/getMatches'
import { getEvent } from './endpoints/getEvent'

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
  connectToScorebot = connectToScorebot(this.config as HLTVConfig)

  public createInstance(config: HLTVConfig) {
    return new Hltv(config)
  }
}

const hltv = new Hltv()

export default hltv
export { hltv as HLTV }

export type {
  Demo,
  Highlight,
  Veto,
  HeadToHeadResult,
  ProviderOdds,
  MapHalfResult,
  MapResult,
  Stream,
  FullMatch as Match,
  MatchStatus
} from './endpoints/getMatch'

export type {
  MatchEventType,
  MatchFilter,
  MatchPreview
} from './endpoints/getMatches'

export type {
  ScoreboardUpdate,
  LogUpdate,
  WinType
} from './endpoints/connectToScorebot'

export type { FullEvent } from './endpoints/getEvent'
