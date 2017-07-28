import UpcomingMatch from '../models/UpcomingMatch'
import LiveMatch from '../models/LiveMatch'
import Event from '../models/Event'
import Team from '../models/Team'
import MapSlug from '../enums/MapSlug'
import * as E from '../utils/parsing'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray, getMatchFormatAndMap } from '../utils/mappers'

const getMatches = async (): Promise<(UpcomingMatch | LiveMatch)[]> => {
    const $ = await fetchPage(`${HLTV_URL}/matches`)

    const liveMatches: LiveMatch[] = toArray($('.live-match .a-reset')).map(matchEl => {
        const id = Number(matchEl.attr('href').split('/')[2])
        const teamEls = matchEl.find('img.logo')
        const stars = matchEl.find('.stars i').length

        const team1: Team = {
            name: teamEls.first().attr('title'),
            id: Number(E.popSlashSource(teamEls.first()))
        }

        const team2: Team = {
            name: teamEls.last().text(),
            id: Number(E.popSlashSource(teamEls.last()))
        }

        const format = matchEl.find('.bestof').text()
        const maps = toArray(matchEl.find('.header .map')).map(E.text) as MapSlug[]

        const event: Event = {
            name:  matchEl.find('.event-logo').attr('title'),
            id: Number((E.popSlashSource(matchEl.find('.event-logo')) as string).split('.')[0])
        }

        return { id, team1, team2, event, format, maps, stars, live: true }
    })

    const upcomingMatches: UpcomingMatch[] = toArray($('.upcoming-match')).map(matchEl => {
        const id = Number(matchEl.attr('href').split('/')[2])
        const date = Number(matchEl.find('div.time').attr('data-unix'))
        const title = matchEl.find('.placeholder-text-cell').text()
        const stars = matchEl.find('.stars i').length

        const { map, format } = getMatchFormatAndMap(matchEl.find('.map-text').text())

        let event: Event | undefined
        let team1: Team | undefined
        let team2: Team | undefined

        if (!title) {
            team1 = {
                name: matchEl.find('div.team').first().text(),
                id: Number(E.popSlashSource(matchEl.find('img.logo').first()))
            }

            team2 = {
                name: matchEl.find('div.team').last().text(),
                id: Number(E.popSlashSource(matchEl.find('img.logo').last()))

            }
            event = {
                name: matchEl.find('.event-logo').attr('alt'),
                id: Number((E.popSlashSource(matchEl.find('img.event-logo')) as string).split('.')[0])
            }
        }

        return { id, date, team1, team2, format, map, title, event, stars, live: false }
    })

    return [...liveMatches, ...upcomingMatches]
}

export default getMatches
