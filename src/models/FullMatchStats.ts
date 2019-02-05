import { Team } from './Team'
import { Event } from './Event'
import { Player } from './Player'

export interface TeamStat extends Team {
  readonly score: number
}

export interface PlayerStat extends Player {
  readonly value: number
}

export interface PlayerStats extends Player {
  assists: number
  flashAssists: number
}

export interface TeamStatComparison {
  readonly team1: number
  readonly team2: number
}

export interface MatchStatsOverview {
  readonly rating: TeamStatComparison
  readonly firstKills: TeamStatComparison
  readonly clutchesWon: TeamStatComparison
  readonly mostKills: PlayerStat
  readonly mostDamage: PlayerStat
  readonly mostAssists: PlayerStat
  readonly mostAWPKills: PlayerStat
  readonly mostFirstKills: PlayerStat
  readonly bestRating: PlayerStat
}

export interface PlayerOverviewStats {
  kills: number
  hsKills: number
  assists: number
  deaths: number
  KAST: number
  killDeathsDifference: number
  ADR: number
  firstKillsDifference: number
  rating: number
}

export interface FullMatchStats {
  readonly matchPageID: number
  readonly team1: Team
  readonly team2: Team
  readonly event: Event
  readonly date: number
  readonly overview: MatchStatsOverview
  readonly playerStats: {
    readonly team1: PlayerStats[]
    readonly team2: PlayerStats[]
  }
}
