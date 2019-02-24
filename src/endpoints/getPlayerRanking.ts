import querystring from 'querystring';
import { PlayerRanking } from '../models/PlayerRanking'
import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'

export const getPlayerRanking = (config: HLTVConfig) => async ({
  startDate,
  endDate,
  matchType,
  rankingFilter
}: {
  startDate: string
  endDate: string
  matchType: string
  rankingFilter: string
}): Promise<PlayerRanking[]> => {
  const query = querystring.stringify({
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
