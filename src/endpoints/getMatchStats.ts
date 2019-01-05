import FullMatchStats, {
    PlayerStat, PlayerStats, MatchStatsOverview, TeamStatComparison 
} from '../models/FullMatchStats'
import Team from '../models/Team'
import Event from '../models/Event'
import * as E from '../utils/parsing'
import HLTVConfig from '../models/HLTVConfig'
import { fetchPage, toArray } from '../utils/mappers'

const getMatchStats = (config: HLTVConfig) => async ({ id }: { id: number }): Promise<FullMatchStats> => {
    const getMatchInfoRowValues = ($: CheerioStatic, index: number): TeamStatComparison => {
        const [ stat1, stat2 ] =  $($('.match-info-row').get(index)).find('.right').text().split(' : ').map(Number)

        return {
            team1: stat1,
            team2: stat2
        }
    }

    const getPlayerTopStat = ($: CheerioStatic, index: number): PlayerStat => {
        return {
            id: Number($($('.most-x-box').get(index)).find('.name > a').attr('href').split('/')[3]),
            name: $($('.most-x-box').get(index)).find('.name > a').text(),
            value: Number($($('.most-x-box').get(index)).find('.valueName').text())
        }
    }

    const m$ = await fetchPage(`${config.hltvUrl}/stats/matches/${id}/-`, config.loadPage);

    const matchPageID = Number(m$('.match-page-link').attr('href').split('/')[2])
    const date = Number(m$('.match-info-box .small-text span').first().attr('data-unix'))

    const team1: Team = {
        id: Number(E.popSlashSource(m$('.team-left .team-logo'))),
        name: m$('.team-left .team-logo').attr('title')
    }

    const team2: Team = {
        id: Number(E.popSlashSource(m$('.team-right .team-logo'))),
        name: m$('.team-right .team-logo').attr('title')
    }

    const event: Event = {
        id: Number(m$('.match-info-box .text-ellipsis').first().attr('href').split('event=')[1]),
        name: m$('.match-info-box .text-ellipsis').first().text()
    }

    const teamStatProperties = ['rating', 'firstKills', 'clutchesWon']
    const teamStats = teamStatProperties.reduce((res, prop, i) => ({...res, [prop]: getMatchInfoRowValues(m$, i)}), {})

    const mostXProperties = ['mostKills', 'mostDamage', 'mostAssists', 'mostAWPKills', 'mostFirstKills', 'bestRating']
    const mostX = mostXProperties.reduce((res, prop, i) => ({...res, [prop]: getPlayerTopStat(m$, i)}), {})

    const overview = {...teamStats, ...mostX} as MatchStatsOverview
    const playerOverviewStats: PlayerStats[] = toArray(m$('.stats-table tbody tr')).map(rowEl => {
        const id = Number(rowEl.find('.st-player a').attr('href').split('/')[3])

        return {
            id,
            name: rowEl.find('.st-player a').text(),
            kills: Number(rowEl.find('.st-kills').contents().first().text()),
            hsKills: Number(rowEl.find('.st-kills .gtSmartphone-only').text().replace(/\(|\)/g, '')),
            assists: Number(rowEl.find('.st-assists').contents().first().text()),
            flashAssists: Number(rowEl.find('.st-assists .gtSmartphone-only').text().replace(/\(|\)/g, '')),
            deaths: Number(rowEl.find('.st-deaths').text()),
            KAST: Number(rowEl.find('.st-kdratio').text().replace('%', '')),
            killDeathsDifference: Number(rowEl.find('.st-kddiff').text()),
            ADR: Number(rowEl.find('.st-adr').text()),
            firstKillsDifference: Number(rowEl.find('.st-fkdiff').text()),
            rating: Number(rowEl.find('.st-rating').text()),
        } as PlayerStats
    })

    const playerStats = {
        team1: playerOverviewStats.slice(0, 5),
        team2: playerOverviewStats.slice(5)
    }

    return {
        matchPageID, date, team1, team2, event, overview, playerStats,
    }
}

export default getMatchStats
