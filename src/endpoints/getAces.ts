import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { fetchPage } from '../utils'

export const getAces =
  (config: HLTVConfig) =>
  async (options: any): Promise<any> => {
    const $ = await fetchPage(
      `https://www.hltv.org/stats/aces?event=5605`,
      config.loadPage
    ).then(HLTVScraper)

    const aces = $('.stats-table > tbody')
      .children()
      .toArray()
      .map((el) => {
        const elements = el.children().toArray()
        const ace = {
          date: el.first().find('a .time').text(),
          team1: elements[1].find('a .gtSmartphone-only').text(),
          team2: elements[2].find('a .gtSmartphone-only').text(),
          map: el.find('.statsMapPlayed .dynamic-map-name-full').text(),
          player: elements[4].find('a').text(),
          round: el.find('.text-center').text()
        }
        return ace
      })
    return aces
  }
