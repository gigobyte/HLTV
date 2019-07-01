import { MatchStatus } from './../enums/MatchStatus'
import { Team } from './Team'
import { Event } from './Event'
import { MapResult } from './MapResult'
import { Stream } from './Stream'
import { Demo } from './Demo'
import { Player } from './Player'
import { HeadToHeadResult } from './HeadToHeadResult'
import { Veto } from './Veto'
import { Highlight } from './Highlight'
import { OddResult, CommunityOddResult } from './OddResult'

export interface FullMatch {
  readonly id: number
  readonly team1?: Team
  readonly team2?: Team
  readonly winnerTeam?: Team
  readonly date: number
  readonly format: string
  readonly additionalInfo: string
  readonly vetoes?: Veto[]
  readonly event: Event
  readonly maps: MapResult[]
  readonly streams: Stream[]
  readonly demos: Demo[]
  readonly players?: {
    team1: Player[]
    team2: Player[]
  }
  readonly title?: string
  readonly live: boolean
  readonly status: MatchStatus
  readonly hasScorebot: boolean
  readonly highlightedPlayer?: Player
  readonly headToHead?: HeadToHeadResult[]
  readonly highlights?: Highlight[]
  readonly odds?: OddResult[]
  readonly oddsCommunity?: CommunityOddResult
}
