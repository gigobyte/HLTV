import Thread from '../models/Thread'
import ThreadCategory from '../enums/ThreadCategory'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray } from '../utils/mappers'

const getRecentThreads = async (): Promise<Thread[]> => {
    const $ = await fetchPage(`${HLTV_URL}`)

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
