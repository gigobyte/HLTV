import { Team } from './Team'

export interface PlayerRanking {
  readonly id?: number
  readonly name: string
  readonly country: string
  readonly teams: Team[]
  readonly maps: number
  readonly kdDiff: number
  readonly kd: number
  readonly rating: number
}
