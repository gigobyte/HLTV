import FullTeamStats from '../models/FullTeamStats'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray, getTimestamp, getMapSlug } from '../utils/mappers'
import * as E from '../utils/parsing'

const getTeamStats = async ({ id }: { id: number }): Promise<FullTeamStats> => {
    const $ = await fetchPage(`${HLTV_URL}/stats/teams/${id}/-`)
    const m$ = await fetchPage(`${HLTV_URL}/stats/teams/matches/${id}/-`)
    const e$ = await fetchPage(`${HLTV_URL}/stats/teams/events/${id}/-`)
    const mp$ = await fetchPage(`${HLTV_URL}/stats/teams/maps/${id}/-`)

    const overviewStats = $('.standard-box .large-strong')
    const getOverviewStatByIndex = i => Number(overviewStats.eq(i).text())
    const [ wins, draws, losses ] = overviewStats.eq(1).text().split('/').map(Number)

    const overview = {
        mapsPlayed: getOverviewStatByIndex(0),
        totalKills: getOverviewStatByIndex(2),
        totalDeaths: getOverviewStatByIndex(3),
        roundsPlayed: getOverviewStatByIndex(4),
        kdRatio: getOverviewStatByIndex(5),
        wins, draws, losses
    }

    const getContainerByText = text => $('.standard-headline').filter((_, el) => $(el).text() === text).parent().next()
    const getPlayersByContainer = container => toArray(container.find('.image-and-label')).map(playerEl => ({
        id: Number(playerEl.attr('href').split('/')[3]),
        name: playerEl.find('.text-ellipsis').text()
    }))

    const currentLineup = getPlayersByContainer(getContainerByText('Current lineup'))
    const historicPlayers = getPlayersByContainer(getContainerByText('Historic players'))
    const standins = getPlayersByContainer(getContainerByText('Standins'))

    const matches = toArray(m$('.stats-table tbody tr')).map(matchEl => ({
        dateApproximate: getTimestamp(matchEl.find('.time a').text()),
        event: {
            id: Number((E.popSlashSource(matchEl.find('.image-and-label img')) as string).split('.')[0]),
            name: matchEl.find('.image-and-label img').attr('title')
        },
        enemyTeam: {
            id: Number(matchEl.find('img.flag').parent().attr('href').split('/')[3]),
            name: matchEl.find('img.flag').parent().contents().last().text()
        },
        map: getMapSlug(matchEl.find('.statsMapPlayed span').text()),
        result: matchEl.find('.statsDetail').text()
    }))

    const events = toArray(e$('.stats-table tbody tr')).map(eventEl => ({
        place: eventEl.find('.statsCenterText').text(),
        event: {
            id: Number(eventEl.find('.image-and-label').first().attr('href').split('=')[1]),
            name: eventEl.find('.image-and-label').first().attr('title')
        }
    }))

    const getMapStat = (mapEl, i) => mapEl.find('.stats-row').eq(i).children().last().text()

    const mapStats = toArray(mp$('.two-grid .col .stats-rows')).reduce((stats, mapEl) => {
        const mapName = getMapSlug(mapEl.prev().find('.map-pool-map-name').text())

        stats[mapName] = {
            wins: Number(getMapStat(mapEl, 0).split(' / ')[0]),
            draws: Number(getMapStat(mapEl, 0).split(' / ')[1]),
            losses: Number(getMapStat(mapEl, 0).split(' / ')[2]),
            winRate: Number(getMapStat(mapEl, 1).split('%')[0]),
            totalRounds: Number(getMapStat(mapEl, 2)),
            roundWinPAfterFirstKill: Number(getMapStat(mapEl, 3).split('%')[0]),
            roundWinPAfterFirstDeath: Number(getMapStat(mapEl, 4).split('%')[0])
        }

        return stats
    }, {})

    return {overview, currentLineup, historicPlayers, standins, events, mapStats, matches}
}

export default getTeamStats