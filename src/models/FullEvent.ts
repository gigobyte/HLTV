import Team from './Team'
import Event from './Event'
import MapSlug from 'enums/MapSlug'
import Country from './Country'

export interface EventPrizeDistribution {
    place: string
    prize?: string
    team?: Team
}

export interface EventTeam extends Team {
    reasonForParticipation?: string
}

export interface EventFormat {
    type: string
    description: string
}

interface FullEvent {
    name: string
    dateStart: number
    dateEnd: number
    prizePool: string
    teams: EventTeam[]
    location: Country
    prizeDistribution: EventPrizeDistribution[]
    formats: EventFormat[]
    relatedEvents: Event[]
    mapPool: MapSlug[]
}

export default FullEvent