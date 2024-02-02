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
import type { CSVersions } from '../shared/CSVersions.js'

export const getDetailedTeamMapStats =
  (config: HLTVConfig) =>
  async (
    options: GetTeamStatsMapsArguments
  ): Promise<Partial<Record<GameMap, DetailedTeamMapStats>> | null> => {
    const query = stringify({
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {}),
      ...(options.matchType ? { matchType: options.matchType } : {}),
      ...(options.rankingFilter
        ? { rankingFilter: options.rankingFilter }
        : {}),
      ...(options.maps ? { maps: toMapFilter(options.maps) } : {}),
      ...(options.bestOfX ? { bestOfX: options.bestOfX } : {}),
      ...(options.csVersion ? { csVersion: options.csVersion } : {})
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
      mapEl[i] ? mapEl[i].find('span').last().text() ?? null : null

    const parseDetailedTeamMapStats = async (url: string, options?: string) => {
      let addr = `https://www.hltv.org` + url + generateRandomSuffix()
      addr += options ? `?${options}` : ''
      const mps$ = await fetchPage(addr, config.loadPage).then(HLTVScraper)
      const stats = mps$('.stats-rows.standard-box').children().toArray()

      const [wins, draws, losses] = (
        getDetailedMapStat(stats, 1)?.split(' / ') ?? []
      ).map(Number)

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
        Number(getDetailedMapStat(stats, 0)),
        Number(getDetailedMapStat(stats, 2)),
        Number(getDetailedMapStat(stats, 3)),
        Number(getDetailedMapStat(stats, 4)?.split('%')[0]),
        Number(getDetailedMapStat(stats, 5)),
        Number(getDetailedMapStat(stats, 6)),
        Number(getDetailedMapStat(stats, 7)?.split('%')[0]),
        Number(getDetailedMapStat(stats, 8)?.split('%')[0]),
        Number(getDetailedMapStat(stats, 9)?.split('%')[0])
      ]
      if (!timesPlayed) return null
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
      if (detailedTeamMapStats) stats[mapName] = detailedTeamMapStats
      await sleep(1000)
    }
    return Object.keys(stats).length > 0 ? stats : null
  }

export interface DetailedTeamMapStats {
  timesPlayed: number | undefined | null
  wins: number | undefined | null
  draws: number | undefined | null
  losses: number | undefined | null
  totalRounds: number | undefined | null
  roundsWon: number | undefined | null
  winPercent: number | undefined | null
  pistolRounds: number | undefined | null
  pistolRoundsWon: number | undefined | null
  pistolRoundWinPercent: number | undefined | null
  ctRoundWinPercent: number | undefined | null
  tRoundWinPercent: number | undefined | null
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
  csVersion?: CSVersions
}
