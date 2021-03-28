import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Country } from '../shared/Country'
import { fetchPage, generateRandomSuffix } from '../utils'

export enum StreamCategory {
  TopPlayer = 'Top player',
  Caster = 'Caster',
  FemalePlayer = 'Female Player'
}

export interface FullStream {
  name: string
  category: StreamCategory
  country: Country
  hltvLink: string
  realLink?: string
  viewers: number
}

export const getStreams = (config: HLTVConfig) => async ({
  loadLinks
}: { loadLinks?: boolean } = {}): Promise<FullStream[]> => {
  const $ = HLTVScraper(
    await fetchPage(
      `https://www.hltv.org/${generateRandomSuffix()}`,
      config.loadPage
    )
  )

  const streams = await Promise.all(
    $('a.col-box.streamer')
      .toArray()
      .map(async (el) => {
        const name = el.find('.name').text()
        const category = el.children().first().attr('title') as StreamCategory

        const country: Country = {
          name: el.find('.flag').attr('title'),
          code: el
            .find('.flag')
            .attrThen('src', (x) => x.split('/').pop()?.split('.')[0]!)
        }

        const viewers = el.contents().last().numFromText()!
        const hltvLink = el.attr('href')

        const stream = { name, category, country, viewers, hltvLink }

        if (loadLinks) {
          const $streamPage = await fetchPage(
            `https://www.hltv.org/${hltvLink}`,
            config.loadPage
          )
          const realLink = $streamPage('iframe').attr('src')

          return { ...stream, realLink }
        }

        return stream
      })
  )

  return streams
}
