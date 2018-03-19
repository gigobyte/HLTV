import FullMatch from '../models/FullMatch'
import Event from '../models/Event'
import MapResult from '../models/MapResult'
import Player from '../models/Player'
import Stream from '../models/Stream'
import Team from '../models/Team'
import Highlight from '../models/Highlight'
import * as E from '../utils/parsing'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray, mapVetoElementToModel, getMapSlug, getMatchPlayer } from '../utils/mappers'

const getMatch = async ({ id }: { id: number }): Promise<FullMatch> => {
    const $ = await fetchPage(`${HLTV_URL}/matches/${id}/-`)

    const title = $('.timeAndEvent .text').text() === ' ' ? undefined : $('.timeAndEvent .text').text()
    const date = Number($('.timeAndEvent .date').attr('data-unix'))
    const format = $('.preformatted-text').text().split('\n')[0]
    const additionalInfo = $('.preformatted-text').text().split('\n').slice(1).join(' ').trim()
    const live = $('.countdown').text() === 'LIVE'
    const hasScorebot = $('#scoreboardElement').length !== 0
    const teamEls = $('div.teamName')

    const team1: Team | undefined = teamEls.first().text() ? {
        name: teamEls.eq(0).text(),
        id: Number(E.popSlashSource(teamEls.first().prev()))
    } : undefined

    const team2: Team | undefined = teamEls.last().text() ? {
        name: teamEls.eq(1).text(),
        id: Number(E.popSlashSource(teamEls.last().prev()))
    } : undefined

    const vetoes = team1 && team2 && toArray($('.veto-box').last().find('.padding > div'))
                                                           .map(el => mapVetoElementToModel(el, team1, team2))

    const event: Event = {
        name: $('.timeAndEvent .event').text(),
        id: Number($('.timeAndEvent .event').children().first().attr('href').split('/')[2])
    }

    const maps: MapResult[] = toArray($('.mapholder')).map((mapEl) => {
        const result = mapEl.find('.results');
        const t_first = result.find('.t').first().text();
        const ct_first = result.find('.ct').first().text();
        const t_second = result.find('.t').last().text();
        const ct_second = result.find('.ct').last().text();
        return {
            name: getMapSlug(mapEl.find('.mapname').text()),
            result: result.text(),
            first_left: result.children().first().next().next().next().next().attr('class'),
            t_first: t_first,
            ct_first: ct_first,
            t_second: t_second,
            ct_second: ct_second
        }
    });

    const mapIds: string[] = toArray($('.stats-menu-link'))
        .filter(mapEl => mapEl.children().attr('id') !== 'all')
        .map((mapEl) => {
            return mapEl.children().attr('id')
    })

    const players = team1 && team2 && {
        team1: toArray($('div.players').first().find('tr').last().find('.flagAlign')).map(getMatchPlayer),
        team2: toArray($('div.players').last().find('tr').last().find('.flagAlign')).map(getMatchPlayer)
    }

    const streams: Stream[] = toArray($('.stream-box')).filter(E.hasChild('.flagAlign')).map(streamEl => ({
        name: streamEl.find('.flagAlign').text(),
        link: streamEl.attr('data-stream-embed'),
        viewers: Number(streamEl.find('.viewers').text())
    }))

    const highlightedPlayerLink: string | undefined = $('.highlighted-player').find('.flag').next().attr('href')


    const highlightedPlayer: Player | undefined = highlightedPlayerLink ? {
        name: highlightedPlayerLink.split('/').pop() as string,
        id: Number(highlightedPlayerLink.split('/')[2]),
    } : undefined

    const highlights: Highlight[] | undefined = team1 && team2 && toArray($('.highlight')).map(highlightEl => ({
        link: highlightEl.attr('data-highlight-embed'),
        title: highlightEl.text()
    }))

    return {
        team1, team2, date, format, additionalInfo, event, maps, mapIds, players, streams, live,
        title, hasScorebot, highlightedPlayer, vetoes, highlights
    }
}

export default getMatch
