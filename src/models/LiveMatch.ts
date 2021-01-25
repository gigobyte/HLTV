import { Team } from './Team'
import { Event } from './Event'

export interface LiveMatch {
  readonly id: number
  readonly url: string
  readonly team1: Team
  readonly team2: Team
  readonly format: string
  readonly event: Event
  readonly live: true
  readonly stars: number
}
