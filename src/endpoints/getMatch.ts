import FullMatch from '../models/FullMatch'
import Event from '../models/Event'
import MapResult from '../models/MapResult'
import Player from '../models/Player'
import Stream from '../models/Stream'
import Team from '../models/Team'
import Highlight from '../models/Highlight'
import Veto from '../models/Veto'
import HeadToHeadResult from '../models/HeadToHeadResult'
import MapSlug from '../enums/MapSlug'
import * as E from '../utils/parsing'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray, mapVetoElementToModel, getMapSlug, getMatchPlayer } from '../utils/mappers'

const getMatch = async ({ id }: { id: number }): Promise<FullMatch> => {
    const $ = await fetchPage(`${HLTV_URL}/matches/${id}/-`)
    console.log($);

    const title = $('.timeAndEvent .text').text().trim() || undefined
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

    let winnerTeam: Team | undefined

    if ($('.team1-gradient').children().last().hasClass('won')) {
        winnerTeam = team1
    }

    if ($('.team2-gradient').children().last().hasClass('won')) {
        winnerTeam = team2
    }

    let vetoes: Veto[] | undefined

    if (team1 && team2) {
        vetoes = toArray($('.veto-box').last().find('.padding > div')).slice(0, -1).map(el => mapVetoElementToModel(el, team1, team2))
    }

    const event: Event = {
        name: $('.timeAndEvent .event').text(),
        id: Number($('.timeAndEvent .event').children().first().attr('href').split('/')[2])
    }

    const maps: MapResult[] = toArray($('.mapholder')).map((mapEl) => {
        const result = mapEl.find('.results');
        return {
            name: getMapSlug(mapEl.find('.mapname').text()),
            result: result.text(),
            first_left: result.children().first().next().next().next().next().attr('class'),
            t_first: result.find('.t').first().text(),
            ct_first: result.find('.ct').first().text(),
            t_second: result.find('.t').last().text(),
            ct_second: result.find('.ct').last().text(),
        }
    });

    let players: {team1: Player[], team2: Player[]} | undefined

    if (team1 && team2) {
        players = {
            team1: toArray($('div.players').first().find('tr').last().find('.flagAlign')).map(getMatchPlayer),
            team2: toArray($('div.players').last().find('tr').last().find('.flagAlign')).map(getMatchPlayer)
        }    
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

    let headToHead: HeadToHeadResult[] | undefined

    if (team1 && team2) {
        headToHead = toArray($('.head-to-head-listing tr')).map(matchEl => ({
            date: Number(matchEl.find('.date a span').attr('data-unix')),
            winner: {
                name: matchEl.find('.winner .flag').next().text(),
                id: Number(matchEl.find('.winner .flag').next().attr('href').split('/')[2])
            },
            event: {
                name: matchEl.find('.event a').text(),
                id: Number(matchEl.find('.event a').attr('href').split('/')[2])
            },
            map: matchEl.find('.dynamic-map-name-short').text() as MapSlug,
            result: matchEl.find('.result').text()
        }))
    } 

    let highlights: Highlight[] | undefined

    if (team1 && team2) {
        highlights = toArray($('.highlight')).map(highlightEl => ({
            link: highlightEl.attr('data-highlight-embed'),
            title: highlightEl.text()
        }))
    }

    return {
        team1, team2, winnerTeam, date, format, additionalInfo, event, maps, players, streams, live,
        title, hasScorebot, highlightedPlayer, headToHead, vetoes, highlights
    }
}

export default getMatch
