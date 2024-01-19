import { stringify } from 'querystring'
import type { HLTVConfig } from '../config.js'
import { fromMapName, toMapFilter } from '../shared/GameMap.js'
import { HLTVScraper, type HLTVPageElement } from '../scraper.js'
import { fetchPage, generateRandomSuffix, sleep } from '../utils.js'
import type {
  BestOfFilter,
  GameMap,
  MatchType,
  RankingFilter
} from '../index.js'

export const getDetailedTeamMapStats =
  (config: HLTVConfig) =>
  async (
    options: GetTeamStatsMapsArguments
  ): Promise<Partial<Record<GameMap, DetailedTeamMapStats>>> => {
    const query = stringify({
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {}),
      ...(options.matchType ? { matchType: options.matchType } : {}),
      ...(options.rankingFilter
        ? { rankingFilter: options.rankingFilter }
        : {}),
      ...(options.maps ? { maps: toMapFilter(options.maps) } : {}),
      ...(options.bestOfX ? { bestOfX: options.bestOfX } : {})
    })
    const mp$ = await fetchPage(
      `https://www.hltv.org/stats/teams/maps/${
        options.id
      }/${generateRandomSuffix()}?${query}`,
      config.loadPage
    ).then(HLTVScraper)

    const getMapStat = (mapEl: HLTVPageElement, i: number) =>
      mapEl.find('.stats-row').eq(i).children().last().text()

    const getDetailedMapStat = (mapEl: HLTVPageElement[], i: number) =>
      mapEl[i]?.find('span').last().text()

    const parseDetailedTeamMapStats = async (url: string, options?: string) => {
      let addr = `https://www.hltv.org` + url + generateRandomSuffix()
      addr += options ? +`?${options}` : ''
      const mps$ = await fetchPage(addr, config.loadPage).then(HLTVScraper)
      const stats = mps$('.stats-rows.standard-box').children().toArray()

      const [wins, draws, losses] = getDetailedMapStat(stats, 1)
        .split(' / ')
        .map(Number)

      const [
        timesPlayed,
        totalRounds,
        roundsWon,
        winPercent,
        pistolRounds,
        pistolRoundsWon,
        pistolRoundWinPercent,
        ctRoundWinPercent,
        tRoundWinPercent
      ] = [
        getDetailedMapStat(stats, 0),
        getDetailedMapStat(stats, 2),
        getDetailedMapStat(stats, 3),
        Number(getDetailedMapStat(stats, 4).split('%')[0]),
        getDetailedMapStat(stats, 5),
        getDetailedMapStat(stats, 6),
        Number(getDetailedMapStat(stats, 7).split('%')[0]),
        Number(getDetailedMapStat(stats, 8).split('%')[0]),
        Number(getDetailedMapStat(stats, 9).split('%')[0])
      ]
      const result: DetailedTeamMapStats = {
        timesPlayed,
        wins,
        draws,
        losses,
        totalRounds,
        roundsWon,
        winPercent,
        pistolRounds,
        pistolRoundsWon,
        pistolRoundWinPercent,
        ctRoundWinPercent,
        tRoundWinPercent
      }
      return result
    }

    const mapStats = mp$('.two-grid .col .stats-rows').toArray()
    const stats: Partial<Record<GameMap, DetailedTeamMapStats>> = {}
    for (const mapEl of mapStats) {
      const mapName = fromMapName(
        mapEl.prev().find('.map-pool-map-name').text()
      )

      let mapUrl: string | undefined = mapEl
        .prev()
        .find('.map-pool a')
        .attr('href')
      const options = mapUrl?.split('?')[1]
      mapUrl = mapUrl.includes('?') ? mapUrl.split('?')[0] : mapUrl
      const detailedTeamMapStats = await parseDetailedTeamMapStats(
        mapUrl,
        options
      )
      stats[mapName] = detailedTeamMapStats
      await sleep(1000)
    }
    return stats
  }

export interface DetailedTeamMapStats {
  timesPlayed: string | undefined
  wins: number | undefined
  draws: number | undefined
  losses: number | undefined
  totalRounds: string | undefined
  roundsWon: string | undefined
  winPercent: number | undefined
  pistolRounds: string | undefined
  pistolRoundsWon: string | undefined
  pistolRoundWinPercent: number | undefined
  ctRoundWinPercent: number | undefined
  tRoundWinPercent: number | undefined
}

export interface GetTeamStatsMapsArguments {
  id: number
  currentRosterOnly?: boolean
  startDate?: string
  endDate?: string
  matchType?: MatchType
  rankingFilter?: RankingFilter
  maps?: GameMap
  bestOfX?: BestOfFilter
}
