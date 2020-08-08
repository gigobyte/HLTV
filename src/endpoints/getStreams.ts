import { FullStream } from '../models/FullStream'
import { Country } from '../models/Country'
import { StreamCategory } from '../enums/StreamCategory'
import { popSlashSource } from '../utils/parsing'
import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'

export const getStreams = (config: HLTVConfig) => async ({
  loadLinks
}: { loadLinks?: boolean } = {}): Promise<FullStream[]> => {
  const $ = await fetchPage(`${config.hltvUrl}`, config.loadPage)

  const streams = Promise.all(
    toArray($('a.col-box.streamer')).map(async (streamEl) => {
      const name = streamEl.find('.name').text()
      const category = streamEl
        .children()
        .first()
        .attr('title') as StreamCategory

      const country: Country = {
        name: streamEl.find('.flag').attr('title')!,
        code: (popSlashSource(streamEl.find('.flag')) as string).split('.')[0]
      }

      const viewers = Number(streamEl.contents().last().text())
      const hltvLink = streamEl.attr('href')!

      const stream = { name, category, country, viewers, hltvLink }

      if (loadLinks) {
        const $streamPage = await fetchPage(
          `${config.hltvUrl}${hltvLink}`,
          config.loadPage
        )
        const realLink = $streamPage('iframe').attr('src')!

        return { ...stream, realLink }
      }

      return stream
    })
  )

  return await streams
}
