import FullStream from '../models/FullStream'
import Country from '../models/Country'
import StreamCategory from '../enums/StreamCategory'
import * as E from '../utils/parsing'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray } from '../utils/mappers'

const getStreams = async ({ loadLinks }: { loadLinks?: boolean } = {}): Promise<FullStream[]> => {
    const $ = await fetchPage(`${HLTV_URL}`)

    const streams = Promise.all(toArray($('a.col-box.streamer')).map(async streamEl => {
        const name = streamEl.find('.name').text()
        const category = streamEl.children().first().attr('title') as StreamCategory

        const country: Country = {
            name: streamEl.find('.flag').attr('title'),
            code: (E.popSlashSource(streamEl.find('.flag')) as string).split('.')[0]
        }

        const viewers = Number(streamEl.contents().last().text()) || undefined
        const hltvLink = streamEl.attr('href')

        const stream = { name, category, country, viewers, hltvLink }

        if (loadLinks) {
            const $streamPage = await fetchPage(`${HLTV_URL}${hltvLink}`)
            const realLink = $streamPage('iframe').attr('src')

            return {...stream, realLink}
        }

        return stream
    }))

    return await streams
}

export default getStreams
