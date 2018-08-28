import MatchResult from '../models/MatchResult'
import Event from '../models/Event'
import Team from '../models/Team'
import MapSlug from '../enums/MapSlug'
import * as E from '../utils/parsing'
import HLTVConfig from '../models/HLTVConfig'
import { fetchPage, toArray, getMatchFormatAndMap } from '../utils/mappers'

const getResults = (config: HLTVConfig) => async ({ pages=1 } = {}): Promise<MatchResult[]> => {
    if (pages < 1) {
        console.error('getLatestResults: pages cannot be less than 1')
        return []
    }

    let matches = [] as MatchResult[]

    for (let i = 0; i < pages; i++) {
        const $ = await fetchPage(`${config.hltvUrl}/results?offset=${i*100}`, config.loadPage)

        matches = matches.concat(toArray($('.results-holder > .results-all > .results-sublist .result-con .a-reset')).map(matchEl => {
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
            const { map, format } = getMatchFormatAndMap(matchEl.find('.map-text').text()) as { map: MapSlug | undefined, format: string }

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
