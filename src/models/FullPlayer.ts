import { Country } from './Country'
import { Team } from './Team'
import { Achievement } from './FullTeam'

export interface FullPlayer {
  readonly id: number
  readonly name?: string
  readonly ign: string
  readonly image?: string
  readonly age?: number
  readonly country: Country
  readonly team?: Team
  readonly twitter?: string
  readonly twitch?: string
  readonly facebook?: string
  readonly instagram?: string
  readonly statistics: {
    rating: number
    killsPerRound: number
    mapsPlayed: number
    deathsPerRound: number
    headshots: number
    roundsContributed: number
  }
  readonly achievements: Achievement[]
}
