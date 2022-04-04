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
  viewers: number
}

export const getStreams =
  (config: HLTVConfig) => async (): Promise<FullStream[]> => {
    const $ = HLTVScraper(
      await fetchPage(
        `https://www.hltv.org/${generateRandomSuffix()}`,
        config.loadPage
      )
    )

    const streams = await Promise.all(
      $('.streams-list')
        .children()
        .toArray()
        .map(async (el) => {
          const name = el.attr('data-frontpage-stream-title')
          const category = el.attr(
            'data-frontpage-stream-type'
          ) as StreamCategory

          const country: Country = {
            name: el.find('.flag').attr('title'),
            code: el
              .find('.flag')
              .attrThen('src', (x) => x.split('/').pop()?.split('.')[0]!)
          }

          const viewers = parseInt(el.attr('data-frontpage-stream-viewers'))!
          const hltvLink = el.attr('data-frontpage-stream-embed-src')

          const stream = { name, category, country, viewers, hltvLink }

          return stream
        })
    )

    return streams
  }
