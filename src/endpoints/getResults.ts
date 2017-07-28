import MatchResult from '../models/MatchResult'
import Event from '../models/Event'
import Team from '../models/Team'
import * as E from '../utils/parsing'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray, getMatchFormatAndMap } from '../utils/mappers'

const getResults = async ({ pages=1 } = {}): Promise<MatchResult[]> => {
    if (pages < 1) {
        console.error('getLatestResults: pages cannot be less than 1')
        return []
    }

    let matches = [] as MatchResult[]

    for (let i = 0; i < pages; i++) {
        const $ = await fetchPage(`${HLTV_URL}/results?offset=${i*100}`)

        matches = matches.concat(toArray($('.result-con .a-reset')).map(matchEl => {
            const id = Number(matchEl.attr('href').split('/')[2])
            const stars = matchEl.find('.stars i').length

            const team1: Team = {
                id: Number(E.popSlashSource(matchEl.find('img.team-logo').first())),
                name: matchEl.find('div.team').first().text()
            }

            const team2: Team = {
                id: Number(E.popSlashSource(matchEl.find('img.team-logo').last())),
                name: matchEl.find('div.team').last().text()
            }

            const result = matchEl.find('.result-score').text()
            const { map, format } = getMatchFormatAndMap(matchEl.find('.map-text').text())

            const event: Event = {
                name: matchEl.find('.event-logo').attr('alt'),
                id: Number((E.popSlashSource(matchEl.find('.event-logo')) as string).split('.')[0])
            }

            return { id, team1, team2, result, event, map, format, stars }
        }))
    }

    return matches
}

export default getResults
