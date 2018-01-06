import Thread from '../models/Thread'
import ThreadCategory from '../enums/ThreadCategory'
import HLTVConfig from '../models/HLTVConfig'
import { fetchPage, toArray } from '../utils/mappers'

const getRecentThreads = (config: HLTVConfig) => async (): Promise<Thread[]> => {
    const $ = await fetchPage(`${config.hltvUrl}`)

    const threads = toArray($('.activity')).map(threadEl => {
        const title = threadEl.find('.topic').text()
        const link = threadEl.attr('href')
        const replies = Number(threadEl.contents().last().text())
        const category = (threadEl.attr('class').split(' ').find(c => c.includes('Cat')) as string).replace('Cat', '') as ThreadCategory

        return { title, link, replies, category }
    })

    return threads
}

export default getRecentThreads
