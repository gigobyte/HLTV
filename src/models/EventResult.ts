import { SimpleEvent } from './SimpleEvent'

export interface EventResult {
  readonly month: string
  readonly events: SimpleEvent[]
}
