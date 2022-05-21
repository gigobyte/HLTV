import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { fetchPage } from '../utils'
import { MatchType } from '../shared/MatchType'
import { BestOfFilter } from '../shared/BestOfFilter'
import { GameMap, toMapFilter } from '../shared/GameMap'
import { RankingFilter } from '../shared/RankingFilter'
import { stringify } from 'querystring'

export interface GetAceArguments {
  matchType?: MatchType
  startDate?: string
  endDate?: string
  bestOfX?: BestOfFilter
  maps?: GameMap[]
  rankingFilter?: RankingFilter
  eventIds?: number[]
}

export const getAces =
  (config: HLTVConfig) =>
  async (options: GetAceArguments): Promise<any> => {
    const query = stringify({
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {}),
      ...(options.matchType ? { matchType: options.matchType } : {}),
      ...(options.maps ? { maps: options.maps.map(toMapFilter) } : {}),
      ...(options.eventIds ? { event: options.eventIds } : {}),
      ...(options.rankingFilter ? { rankingFilter: options.rankingFilter } : {})
    })

    const $ = await fetchPage(
      `https://www.hltv.org/stats/aces?${query}`,
      config.loadPage
    ).then(HLTVScraper)

    const aces = $('.stats-table > tbody')
      .children()
      .toArray()
      .map((el) => {
        const ace = {
          date: el.first().find('a .time').text(),
          team1: el.children().toArray()[1].find('a .gtSmartphone-only').text(),
          team2: el.children().toArray()[2].find('a .gtSmartphone-only').text(),
          map: el.find('.statsMapPlayed .dynamic-map-name-full').text(),
          player: el.children().toArray()[4].find('a').text(),
          round: el.find('.text-center').text()
        }
        return ace
      })
    return aces
  }
