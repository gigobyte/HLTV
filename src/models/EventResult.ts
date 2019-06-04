import { SimpleEvent } from './SimpleEvent'

export interface EventResult {
  readonly month: number
  readonly events: SimpleEvent[]
}
