import { stringify } from 'querystring'
import { PlayerRanking } from '../models/PlayerRanking'
import { MatchType } from '../enums/MatchType'
import { RankingFilter } from '../enums/RankingFilter'
import { Map } from '../enums/Map'
import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { BestOfFilter } from '../enums/BestOfFilter'
import { Team } from '../models/Team'
import { checkForRateLimiting } from '../utils/checkForRateLimiting'

export const getPlayerRanking = (config: HLTVConfig) => async (
  options: {
    startDate?: string
    endDate?: string
    matchType?: MatchType
    rankingFilter?: RankingFilter
    maps?: Map[]
    minMapCount?: number
    country?: string[]
    bestOfX?: BestOfFilter
  } = {}
): Promise<PlayerRanking[]> => {
  const query = stringify({
    ...(options.startDate ? { startDate: options.startDate } : {}),
    ...(options.endDate ? { endDate: options.endDate } : {}),
    ...(options.matchType ? { matchType: options.matchType } : {}),
    ...(options.rankingFilter ? { rankingFilter: options.rankingFilter } : {}),
    ...(options.maps ? { maps: options.maps } : {}),
    ...(options.minMapCount ? { minMapCount: options.minMapCount } : {}),
    ...(options.country ? { country: options.country } : {}),
    ...(options.bestOfX ? { bestOfX: options.bestOfX } : {})
  })

  const $ = await fetchPage(
    `${config.hltvUrl}/stats/players?${query}`,
    config.loadPage
  )

  checkForRateLimiting($)

  return toArray($('.player-ratings-table tbody tr')).map((playerRow) => {
    const id = Number(
      playerRow.find('.playerCol a').first().attr('href')!.split('/')[3]
    )
    const country =
      playerRow.find('.playerCol img.flag').eq(0).attr('alt') || ''
    const name = playerRow.find('.playerCol').text()
    const rating = Number(playerRow.find('.ratingCol').text())
    const teams: Team[] = toArray(playerRow.find('.teamCol a')).map(
      (teamEl) => {
        let id
        const hrefAttr = $(teamEl).attr('href')

        if (hrefAttr) {
          const idRegex = hrefAttr.match(/\/stats\/teams\/(\d+)\/.*/)
          if (idRegex && idRegex[1]) {
            id = Number(idRegex[1])
          }
        }

        const name = $(teamEl).find('img.logo').eq(0).attr('alt') || ''

        return {
          id,
          name
        }
      }
    )
    const maps = Number(playerRow.find('td.statsDetail').eq(0).text())
    const kdDiff = Number(playerRow.find('td.kdDiffCol').text())
    const kd = Number(playerRow.find('td.statsDetail').eq(1).text())

    return {
      id,
      name,
      country,
      teams,
      maps,
      kdDiff,
      kd,
      rating
    }
  })
}
