import { Country } from './Country'
import { Team } from './Team'

export interface FullPlayerStats {
  readonly name?: string
  readonly ign?: string
  readonly image?: string
  readonly age?: number
  readonly country: Country
  readonly team?: Team
  readonly statistics: {
    kills: string
    headshots: string
    deaths: string
    kdRatio: string
    damagePerRound: string
    granadeDamagePerRound: string
    mapsPlayed: string
    roundsPlayed: string
    killsPerRound: string
    assistsPerRound: string
    deathsPerRound: string
    savedByTeammatePerRound: string
    savedTeammatesPerRound: string
    rating: string
  }
}
