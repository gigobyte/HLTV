export interface OngoingEventResult {
  readonly name: string
  readonly id: number
  readonly dateStart: number
  readonly dateEnd: number
  readonly today: boolean
  readonly featured: boolean
}
