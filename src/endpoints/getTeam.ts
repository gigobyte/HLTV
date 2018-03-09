import FullTeam, { Result, Achievement } from '../models/FullTeam'
import Player from '../models/Player'
import HLTVConfig from '../models/HLTVConfig'
import { fetchPage, toArray, getMapsStatistics } from '../utils/mappers'
import * as E from '../utils/parsing'

const getTeam = (config: HLTVConfig) => async ({ id }: { id: number }): Promise<FullTeam> => {
    const t$ = await fetchPage(`${config.hltvUrl}/team/${id}/-`)
    const e$ = await fetchPage(`${config.hltvUrl}/events?team=${id}`)

    const name = t$('.team-name').text()
    const logo = `${config.hltvStaticUrl}/images/team/logo/${id}`
    const coverImage = t$('.coverImage').attr('data-bg-image')
    const location = t$('.team-country .flag').attr('alt')
    const facebook = t$('.facebook').parent().attr('href')
    const twitter = t$('.twitter').parent().attr('href')
    const rank = Number(t$('.profile-team-stat .right').first().text().replace('#', '')) || undefined

    const arePlayerPicturesOfficial = toArray(t$('.overlayImageFrame')).length > 0
    const playerSelector = arePlayerPicturesOfficial ? '.overlayImageFrame' : '.overlayImageFrame-square'
    const playerImageSelector = arePlayerPicturesOfficial ? '.bodyshot-team-img' : '.profileImage'

    const getPlayerId = (el: Cheerio) => arePlayerPicturesOfficial
        ? Number((E.popSlashSource(el) as string).split('.')[0])
        : Number(el.attr('src').split('/').slice(-2, -1))

    const players: Player[] = toArray(t$(playerSelector)).filter(E.hasChild('.playerFlagName .text-ellipsis')).map(playerEl => ({
        name: playerEl.find('.playerFlagName .text-ellipsis').text(),
        id: getPlayerId(playerEl.find(playerImageSelector))
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

    let rankingDevelopment
    
    try {
        const rankings = JSON.parse(t$('.graph').attr('data-fusionchart-config'))
        rankingDevelopment = rankings.dataSource.dataset[0].data.map(x => x.value).map(Number)
    } catch {
        rankingDevelopment = []
    }

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
    }))).concat(toArray(e$('.tab-content:not(.hidden) a.ongoing-event')).map(eventEl => ({
        name: eventEl.find('.event-name-small .text-ellipsis').text(),
        id: Number(eventEl.attr('href').split('/')[2])
    })))

    return {name, logo, coverImage, location, facebook, twitter, rank, players, recentResults, rankingDevelopment, bigAchievements, mapStatistics, events}
}

export default getTeam