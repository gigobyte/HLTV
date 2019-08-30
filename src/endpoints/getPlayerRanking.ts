import { stringify } from 'querystring'
import { PlayerRanking } from '../models/PlayerRanking'
import { MatchType } from '../enums/MatchType'
import { RankingFilter } from '../enums/RankingFilter'
import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'

export const getPlayerRanking = (config: HLTVConfig) => async ({
  startDate,
  endDate,
  matchType,
  rankingFilter
}: {
  startDate?: string
  endDate?: string
  matchType?: MatchType
  rankingFilter?: RankingFilter
}): Promise<PlayerRanking[]> => {
  const query = stringify({
    startDate,
    endDate,
    matchType,
    rankingFilter
  })

  const $ = await fetchPage(`${config.hltvUrl}/stats/players?${query}`, config.loadPage)

  const players = toArray($('.player-ratings-table tbody tr')).map(matchEl => {
    var id = Number(
      matchEl
        .find('.playerCol a')
        .first()
        .attr('href')
        .split('/')[3]
    )
    var name = matchEl.find('.playerCol').text()
    var rating = Number(matchEl.find('.ratingCol').text())
    return { id: id, name: name, rating: rating }
  })

  return players
}
