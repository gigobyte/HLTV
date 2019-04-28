import { Country } from './Country'

export interface SimpleEvent {
  id: number
  name: string
  dateStart?: number
  dateEnd?: number
  prizePool: string
  teams?: number
  location: Country
  host?: string
}
