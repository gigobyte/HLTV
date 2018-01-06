import FullTeam, { Result, Achievement } from '../models/FullTeam'
import Player from '../models/Player'
import HLTVConfig from '../models/HLTVConfig'
import { fetchPage, toArray, getMapsStatistics } from '../utils/mappers'
import * as E from '../utils/parsing'

const getTeam = (config: HLTVConfig) => async ({ id }: { id: number }): Promise<FullTeam> => {
    const t$ = await fetchPage(`${config.hltvUrl}/team/${id}/-`)
    const e$ = await fetchPage(`${config.hltvUrl}/events?team=${id}`)

    const name = t$('.subjectname').text()
    const logo = `${config.hltvStaticUrl}/images/team/logo/${id}`
    const coverImage = t$('.coverImage').attr('data-bg-image')
    const location = t$(t$('.fa-map-marker').parent().contents().get(3)).text().trim()
    const facebook = t$(t$('.fa-map-marker').parent().contents().get(4)).attr('href')
    const twitter = t$(t$('.fa-map-marker').parent().contents().get(6)).attr('href')
    const rank = Number(t$(t$('.fa-map-marker').parent().contents().last()).text().split('#')[1]) || undefined

    const players: Player[] = toArray(t$('.overlayImageFrame')).filter(E.hasChild('.playerFlagName .text-ellipsis')).map(playerEl => ({
        name: playerEl.find('.playerFlagName .text-ellipsis').text(),
        id: Number(playerEl.find('.playerFlagName .text-ellipsis').attr('href').split('/')[2])
    }))

    const recentResults: Result[] = toArray(t$('.results-holder .a-reset')).map(matchEl => ({
        matchID: matchEl.attr('href') ? Number(matchEl.attr('href').split('/')[2]) : undefined,
        enemyTeam: {
            id: Number(E.popSlashSource(t$(matchEl.find('.team-logo').get(1))) as string),
            name: t$(matchEl.find('.team').get(1)).text()
        },
        result: matchEl.find('.result-score').text(),
        event: {
            id: Number((E.popSlashSource(matchEl.find('.event-logo')) as string).split('.')[0]),
            name: matchEl.find('.event-name').text()
        }
    }))

    const rankingDevRegex = /value":"\d+(?="})/g

    const rankings = t$('.graph').attr('data-fusionchart-config').match(rankingDevRegex)
    const hasRank = t$('.graph').attr('data-fusionchart-config').match(rankingDevRegex) !== null
    const rankingDevelopment = hasRank ? (rankings as RegExpMatchArray).map(m => m.split(':"')[1]).map(Number) : undefined

    const bigAchievements: Achievement[] = toArray(t$('.achievement')).map(achEl => ({
        place: t$(achEl.contents().get(1)).text().split(' at')[0],
        event: {
            name: t$(achEl.contents().get(2)).text(),
            id: Number(t$(achEl.contents().get(2)).attr('href').split('/')[2])
        }
    }))

    const mapStatistics = getMapsStatistics(t$(t$('.graph').get(1)).attr('data-fusionchart-config'))

    const events = toArray(e$('a.big-event')).map(eventEl => ({
        name: eventEl.find('.big-event-name').text(),
        id: Number(eventEl.attr('href').split('/')[2])
    })).concat(toArray(e$('a.small-event')).map(eventEl => ({
        name: eventEl.find('.event-col .text-ellipsis').text(),
        id: Number(eventEl.attr('href').split('/')[2])
    }))).concat(toArray(e$('a.ongoing-event')).map(eventEl => ({
        name: eventEl.find('.event-name-small .text-ellipsis').text(),
        id: Number(eventEl.attr('href').split('/')[2])
    })))

    return {name, logo, coverImage, location, facebook, twitter, rank, players, recentResults, rankingDevelopment, bigAchievements, mapStatistics, events}
}

export default getTeam