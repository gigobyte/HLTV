import { Team } from './Team'
import { Event } from './Event'

export interface UpcomingMatch {
  readonly id: number
  readonly team1?: Team
  readonly team2?: Team
  readonly date?: number
  readonly format?: string
  readonly event?: Event
  readonly title?: string
  readonly live: false
  readonly stars: number
}
