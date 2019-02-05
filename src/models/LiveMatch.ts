import { Team } from './Team'
import { Event } from './Event'
import { MapSlug } from '../enums/MapSlug'

export interface LiveMatch {
  readonly id: number
  readonly team1: Team
  readonly team2: Team
  readonly format: string
  readonly event: Event
  readonly maps: MapSlug[]
  readonly live: boolean
  readonly stars: number
}
