import { Thread } from '../models/Thread'
import { ThreadCategory } from '../enums/ThreadCategory'
import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'

export const getRecentThreads = (config: HLTVConfig) => async (): Promise<Thread[]> => {
  const $ = await fetchPage(`${config.hltvUrl}`, config.loadPage)

  const threads = toArray($('.activity')).map(threadEl => {
    const title = threadEl.find('.topic').text()
    const link = threadEl.attr('href')
    const replies = Number(
      threadEl
        .contents()
        .last()
        .text()
    )
    const category = threadEl
      .attr('class')
      .split(' ')
      .find(c => c.includes('Cat'))!
      .replace('Cat', '') as ThreadCategory

    return { title, link, replies, category }
  })

  return threads
}
