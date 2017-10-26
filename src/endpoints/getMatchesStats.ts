import MatchStats from '../models/MatchStats'
import Event from '../models/Event'
import Team from '../models/Team'
import MatchType from '../enums/MatchType'
import Map from '../enums/Map'
import MapSlug from '../enums/MapSlug'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray } from '../utils/mappers'

export type GetMatchesStatsParams = {
    startDate?: string,
    endDate?: string,
    matchType?: MatchType,
    maps?: Map[]
}

const getMatchesStats = async ({ startDate, endDate, matchType, maps }: GetMatchesStatsParams = {}): Promise<MatchStats[]> => {
    const query = `startDate=${startDate}&endDate=${endDate}&matchtype=${matchType}${['', ...maps].join('&maps=')}`

    let page = 0
    let $: CheerioStatic
    let matches = [] as MatchStats[]

    do {
        $ = await fetchPage(`${HLTV_URL}/stats/matches?${query}&offset=${page*50}`)
        page++

        matches = matches.concat(toArray($('.matches-table tbody tr')).map(matchEl => {
            const id = Number(matchEl.find('.date-col a').attr('href').split('/')[4]) || undefined
            const date = Number(matchEl.find('.time').attr('data-unix')) || undefined
            const map = matchEl.find('.dynamic-map-name-short').text() as MapSlug

            const team1: Team = {
                id: Number(matchEl.find('.team-col a').first().attr('href').split('/')[3]) || undefined,
                name: matchEl.find('.team-col a').first().text()
            }

            const team2: Team = {
                id: Number(matchEl.find('.team-col a').last().attr('href').split('/')[3]) || undefined,
                name: matchEl.find('.team-col a').last().text()
            }

            const event: Event = {
                id: Number(matchEl.find('.event-col a').attr('href').split('event=')[1].split('&')[0]) || undefined,
                name: matchEl.find('.event-col a').text()
            }

            const result = {
                team1: Number(matchEl.find('.team-col .score').first().text().trim().replace(/\(|\)/g, '')) || undefined,
                team2: Number(matchEl.find('.team-col .score').last().text().trim().replace(/\(|\)/g, '')) || undefined
            }

            return { id, date, map, team1, team2, event, result }
        }))
    } while($('.matches-table tbody tr').length !== 0)

    return matches
}

export default getMatchesStats
