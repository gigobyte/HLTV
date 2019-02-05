import { MapSlug } from '../enums/MapSlug'

export interface MapResult {
  readonly name: MapSlug
  readonly result: string
  readonly statsId?: number
}
