import { ThreadCategory } from '../enums/ThreadCategory'

export interface Thread {
  readonly title: string
  readonly link: string
  readonly replies: number
  readonly category: ThreadCategory
}
