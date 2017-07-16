import * as io from 'socket.io-client'
import * as E from './utils/parsing'
import * as utils from './utils/misc'
import FullMatch from './models/FullMatch'
import UpcomingMatch from './models/UpcomingMatch'
import LiveMatch from './models/LiveMatch'
import Event from './models/Event'
import MapResult from './models/MapResult'
import Player from './models/Player'
import Stream from './models/Stream'
import Team from './models/Team'
import MatchResult from './models/MatchResult'
import FullStream from './models/FullStream'
import Country from './models/Country'
import Thread from './models/Thread'
import TeamRanking from './models/TeamRanking'
import ScoreboardUpdate from './models/ScoreboardUpdate'
import LogUpdate from './models/LogUpdate'
import HeadToHeadResult from './models/HeadToHeadResult'
import Highlight from './models/Highlight'
import MapSlug from './enums/MapSlug'
import StreamCategory from './enums/StreamCategory'
import ThreadCategory from './enums/ThreadCategory'

const HLTV_URL = 'http://www.hltv.org'

export type connectToScorebotParams = {
    id: number,
    onScoreboardUpdate?: (data: ScoreboardUpdate) => any,
    onLogUpdate?: (data: LogUpdate) => any,
    onConnect?: () => any,
    onDisconnect?: () => any
}

class HLTV {
    private static getMatchPlayer(playerEl: Cheerio): Player {
        return {
            name: playerEl.find('.flagAlign .text-ellipsis').text(),
            id: Number(playerEl.attr('href').split('/')[2])
        }
    }

    private static getMatchFormatAndMap(mapText: string): {map?: MapSlug, format: string} {
        if (mapText && !mapText.includes('bo')) {
            return { map: mapText as MapSlug, format: 'bo1'}
        }

        return { format: mapText }
    }

    static async getMatch({ id }: { id: number }): Promise<FullMatch> {
        const $ = await utils.fetchPage(`${HLTV_URL}/matches/${id}/-`)

        const teamEls = $('div.teamName')

        const team1: Team | undefined = teamEls.first().text() ? {
            name: teamEls.first().text(),
            id: Number(E.popSlashSource(teamEls.first().prev()))
        } : undefined

        const team2: Team | undefined = teamEls.last().text() ? {
            name: teamEls.last().text(),
            id: Number(E.popSlashSource(teamEls.last().prev()))
        } : undefined

        const title = $('.timeAndEvent .text').text() === ' ' ? undefined : $('.timeAndEvent .text').text()
        const date = Number($('.timeAndEvent .date').attr('data-unix'))
        const format = $('.preformatted-text').text().split('\n')[0]
        const additionalInfo = $('.preformatted-text').text().split('\n').slice(1).join(' ').trim()
        const live = $('.countdown').text() === 'LIVE'
        const hasScorebot = $('#scoreboardElement').length !== 0

        const vetoes = team1 && team2 && utils.toArray($('.veto-box').last().find('.padding > div'))
                                              .slice(0, -1).map(el => utils.mapVetoElementToModel(el, team1, team2))

        const event: Event = {
            name: $('.timeAndEvent .event').text(),
            id: Number($('.timeAndEvent .event').children().first().attr('href').split('/')[2])
        }

        const maps: MapResult[] = utils.toArray($('.mapholder')).map(mapEl => ({
            name: utils.getMapSlug(mapEl.find('.mapname').text()),
            result: mapEl.find('.results').text()
        }))

        const players = team1 && team2 && {
            [team1.id]: utils.toArray($('div.players').first().find('tr').last().find('.player > a')).map(HLTV.getMatchPlayer),
            [team2.id]: utils.toArray($('div.players').last().find('tr').last().find('.player > a')).map(HLTV.getMatchPlayer)
        }

        const streams: Stream[] = utils.toArray($('.stream-box')).filter(E.hasChild('.flagAlign')).map(streamEl => ({
            name: streamEl.find('.flagAlign').text(),
            link: streamEl.attr('data-stream-embed'),
            viewers: Number(streamEl.find('.viewers').text())
        }))

        const highlightedPlayerLink: string | undefined = $('.highlighted-player').find('.flag').next().attr('href')

        const highlightedPlayer: Player | undefined = highlightedPlayerLink ? {
            name: highlightedPlayerLink.split('/').pop() as string,
            id: Number(highlightedPlayerLink.split('/')[2]),
        } : undefined

        const headToHead: HeadToHeadResult[] | undefined = team1 && team2 && utils.toArray($('.head-to-head-listing tr')).map(matchEl => ({
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

        const highlights: Highlight[] | undefined = team1 && team2 && utils.toArray($('.highlight')).map(highlightEl => ({
            link: highlightEl.attr('data-highlight-embed'),
            title: highlightEl.text()
        }))

        return {
            team1, team2, date, format, additionalInfo, event, maps, players, streams, live,
            title, hasScorebot, highlightedPlayer, headToHead, vetoes, highlights
        }
    }

    static async getMatches(): Promise<(UpcomingMatch | LiveMatch)[]> {
        const $ = await utils.fetchPage(`${HLTV_URL}/matches`)

        const liveMatches: LiveMatch[] = utils.toArray($('.live-match .a-reset')).map(matchEl => {
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
            const maps = utils.toArray(matchEl.find('.header .map')).map(E.text) as MapSlug[]

            const event: Event = {
                name:  matchEl.find('.event-logo').attr('title'),
                id: Number((E.popSlashSource(matchEl.find('.event-logo')) as string).split('.')[0])
            }

            return { id, team1, team2, event, format, maps, stars, live: true }
        })

        const upcomingMatches: UpcomingMatch[] = utils.toArray($('.upcoming-match')).map(matchEl => {
            const id = Number(matchEl.attr('href').split('/')[2])
            const date = Number(matchEl.find('div.time').attr('data-unix'))
            const title = matchEl.find('.placeholder-text-cell').text()
            const stars = matchEl.find('.stars i').length

            const { map, format } = HLTV.getMatchFormatAndMap(matchEl.find('.map-text').text())

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

    static async getLatestResults({ pages=1 } = {}): Promise<MatchResult[]> {
        if (pages < 1) {
            console.error('HLTV.getLatestResults: pages cannot be less than 1')
            return []
        }

        let matches = [] as MatchResult[]

        for (let i = 0; i < pages; i++) {
            const $ = await utils.fetchPage(`${HLTV_URL}/results?offset=${i*100}`)

            matches = matches.concat(utils.toArray($('.result-con .a-reset')).map(matchEl => {
                const id = Number(matchEl.attr('href').split('/')[2])

                const team1: Team = {
                    id: Number(E.popSlashSource(matchEl.find('img.team-logo').first())),
                    name: matchEl.find('div.team').first().text()
                }

                const team2: Team = {
                    id: Number(E.popSlashSource(matchEl.find('img.team-logo').last())),
                    name: matchEl.find('div.team').last().text()
                }

                const result = matchEl.find('.result-score').text()
                const { map, format } = HLTV.getMatchFormatAndMap(matchEl.find('.map-text').text())

                const event: Event = {
                    name: matchEl.find('.event-logo').attr('alt'),
                    id: Number((E.popSlashSource(matchEl.find('.event-logo')) as string).split('.')[0])
                }

                return { id, team1, team2, result, event, map, format }
            }))
        }

        return matches
    }

    static async getStreams({ loadLinks }: { loadLinks?: boolean } = {}): Promise<FullStream[]> {
        const $ = await utils.fetchPage(`${HLTV_URL}`)

        const streams = Promise.all(utils.toArray($('a.col-box.streamer')).map(async streamEl => {
            const name = streamEl.find('.name').text()
            const category = streamEl.children().first().attr('title') as StreamCategory

            const country: Country = {
                name: streamEl.find('.flag').attr('title'),
                code: (E.popSlashSource(streamEl.find('.flag')) as string).split('.')[0]
            }

            const viewers = Number(streamEl.contents().last().text())
            const hltvLink = streamEl.attr('href')

            const stream = { name, category, country, viewers, hltvLink }

            if (loadLinks) {
                const $streamPage = await utils.fetchPage(`${HLTV_URL}${hltvLink}`)
                const realLink = $streamPage('iframe').attr('src')

                return {...stream, realLink}
            }

            return stream
        }))

        return await streams
    }

    static async getActiveThreads(): Promise<Thread[]> {
        const $ = await utils.fetchPage(`${HLTV_URL}`)

        const threads = utils.toArray($('.activity')).map(threadEl => {
            const title = threadEl.find('.topic').text()
            const link = threadEl.attr('href')
            const replies = Number(threadEl.contents().last().text())
            const category = (threadEl.attr('class').split(' ').find(c => c.includes('Cat')) as string).replace('Cat', '') as ThreadCategory

            return { title, link, replies, category }
        })

        return threads
    }

    static async getTeamRanking({ year='', month='', day='' } = {}): Promise<TeamRanking[]> {
        const $ = await utils.fetchPage(`${HLTV_URL}/ranking/teams/${year}/${month}/${day}`)

        const teams = utils.toArray($('.ranked-team')).map(teamEl => {
            const points = Number(teamEl.find('.points').text().replace(/\(|\)/g, '').split(' ')[0])
            const place = Number(teamEl.find('.position').text().substring(1))

            const team: Team = {
                name: teamEl.find('.name').text(),
                id: Number(teamEl.find('.name').attr('data-url').split('/')[2])
            }

            const changeText = teamEl.find('.change').text()
            const change = changeText === '-' ? 0 : Number(changeText)

            return { points, place, team, change }
        })

        return teams
    }

    static async connectToScorebot({ id, onScoreboardUpdate, onLogUpdate, onConnect, onDisconnect }: connectToScorebotParams) {
        const $ = await utils.fetchPage(`${HLTV_URL}/matches/${id}/-`)
        const url = $('#scoreboardElement').attr('data-scorebot-url')
        const matchId = $('#scoreboardElement').attr('data-scorebot-id')

        const socket = io.connect(url)

        socket.on('connect', () => {
            if (onConnect) {
                onConnect()
            }

            socket.emit('readyForMatch', matchId)

            socket.on('scoreboard', (data) => {
                if (onScoreboardUpdate) {
                    onScoreboardUpdate(data)
                }
            })

            socket.on('log', (data) => {
                if (onLogUpdate) {
                    onLogUpdate(JSON.parse(data))
                }
            })
        })

        socket.on('reconnect', () => {
            socket.emit('readyForMatch', matchId)
        })

        socket.on('disconnect', () => {
            if (onDisconnect) {
                onDisconnect()
            }
        })
    }
}

export default HLTV
export { HLTV }
