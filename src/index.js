import cheerio from 'cheerio'
import fetch from 'isomorphic-fetch'
import io from 'socket.io-client'

const HLTV_URL = 'http://www.hltv.org'

const toArray = elements => elements.toArray().map(cheerio)
const fetchPage = async url => cheerio.load(await fetch(url).then(res => res.text()))
const noop = () => {}

class HLTV {
    _getMatchFormatAndMap(mapText) {
        if (mapText && !mapText.includes('bo')) {
            return { maps: [mapText], format: 'bo1'}
        }

        return { format: mapText }
    }

    async getMatch({ id }) {
        const $ = await fetchPage(`${HLTV_URL}/matches/${id}/-`)

        const teamEls = toArray($('div.teamName'))

        const [ team1, team2 ] = teamEls.map(el => el.text())
        const [ team1Id, team2Id ] = teamEls.map(el => el.prev()).map(logo => logo.attr('src').split('/').pop()).map(Number)

        const title = $('.timeAndEvent .text').text()
        const date = Number($('.timeAndEvent .date').attr('data-unix'))
        const format = $('.preformatted-text').text().split('\n')[0]
        const additionalInfo = $('.preformatted-text').text().split('\n').slice(1).join(' ')
        const live = date < Date.now()

        const event = {
            name: $('.timeAndEvent .event').text(),
            link: $('.timeAndEvent .event').children().first().attr('href')
        }

        const maps = toArray($('.mapholder')).map(mapEl => ({
            name: mapEl.find('.mapname').text(),
            result: mapEl.find('.results').text()
        }))

        const players = {
            [team1]: toArray($('div.players').first().find('.player > a .flagAlign .text-ellipsis')).map(el => el.text()),
            [team2]: toArray($('div.players').last().find('.player > a .flagAlign .text-ellipsis')).map(el => el.text())
        }

        const streams = toArray($('.stream-box')).map(streamEl => ({
            name: streamEl.find('.flagAlign').text(),
            link: streamEl.attr('data-stream-embed')
        }))

        return {
            team1, team2, team1Id, team2Id, date, format, additionalInfo, event, maps, players, streams, live
        }
    }

    async getMatches() {
        const $ = await fetchPage(`${HLTV_URL}/matches`)

        const liveMatches = toArray($('.live-match .a-reset')).map(matchEl => {
            const id = Number(matchEl.attr('href').split('/')[2])
            const [ team1, team2 ] = toArray(matchEl.find('img.logo')).map(el => el.attr('title'))
            const [ team1Id, team2Id ] = toArray(matchEl.find('img.logo')).map(el => el.attr('src').split('/').pop()).map(Number)
            const format = matchEl.find('.bestof').text()
            const maps = toArray(matchEl.find('.header .map')).map(el => el.text())
            const event = {
                name:  matchEl.find('.event-logo').attr('alt'),
                id: Number(matchEl.find('.event-logo').attr('src').split('/').pop().split('.')[0])
            }

            return { id, team1, team2, team1Id, team2Id, event, format, maps, live: true }
        })

        const upcomingMatches = toArray($('.upcoming-match')).map(matchEl => {
            const id = Number(matchEl.attr('href').split('/')[2])
            const date = Number(matchEl.find('div.time').attr('data-unix'))
            const [ team1, team2 ] = toArray(matchEl.find('div.team')).map(el => el.text())
            const [ team1Id, team2Id ] = toArray(matchEl.find('img.logo')).map(el => el.attr('src').split('/').pop()).map(Number)
            const { maps, format } = this._getMatchFormatAndMap(matchEl.find('.map-text').text())
            const label = matchEl.find('.placeholder-text-cell').text()
            const event = {
                name: matchEl.find('.event-logo').attr('alt'),
                id: do {
                    if (matchEl.find('.event-logo').attr('src')) {
                        Number(matchEl.find('img.event-logo').attr('src').split('/').pop().split('.')[0])
                    }
                }
            }

            return { id, date, team1, team2, team1Id, team2Id, format, maps, label, event, live: false }
        })

        return [...liveMatches, ...upcomingMatches]
    }

    async getLatestResults({ pages=1 } = {}) {
        if (pages < 1) {
            throw new Error('HLTV.getLatestResults: pages cannot be less than 1')
        }

        let matches = []

        for (let i = 0; i < pages; i++) {
            const $ = await fetchPage(`${HLTV_URL}/results?offset=${i*100}`)

            matches = matches.concat(toArray($('.result-con .a-reset')).map(matchEl => {
                const id = Number(matchEl.attr('href').split('/')[2])
                const [ team1, team2 ] = toArray(matchEl.find('div.team')).map(el => el.text())
                const [ team1Id, team2Id ] = toArray(matchEl.find('img.team-logo')).map(el => el.attr('src').split('/').pop()).map(Number)
                const result = matchEl.find('.result-score').text()
                const { maps, format } = this._getMatchFormatAndMap(matchEl.find('.map-text').text())
                const event = {
                    name:  matchEl.find('.event-logo').attr('alt'),
                    id: Number(matchEl.find('.event-logo').attr('src').split('/').pop().split('.')[0])
                }

                return { id, team1, team2, team1Id, team2Id, result, event, maps, format }
            }))
        }

        return matches
    }

    async getStreams({ loadLinks } = {}) {
        const $ = await fetchPage(`${HLTV_URL}`)

        const streams = Promise.all(toArray($('a.col-box.streamer')).map(async streamEl => {
            const name = streamEl.find('.name').text()
            const category = streamEl.children().first().attr('title')
            const country = {
                name: streamEl.find('.flag').attr('title'),
                code: streamEl.find('.flag').attr('src').split('/').pop().split('.')[0]
            }
            const viewers = Number(streamEl.contents().last().text())
            const hltvLink = streamEl.attr('href')

            if (loadLinks) {
                const $streamPage = await fetchPage(`${HLTV_URL}${hltvLink}`)
                var realLink = $streamPage('iframe').attr('src')
            }

            return { name, category, country, viewers, hltvLink, realLink }
        }))

        return await streams
    }

    async getActiveThreads() {
        const $ = await fetchPage(`${HLTV_URL}`)

        const threads = toArray($('.activity')).map(threadEl => {
            const title = threadEl.find('.topic').text()
            const link = threadEl.attr('href')
            const replies = Number(threadEl.contents().last().text())
            const category = threadEl.attr('class').split(' ').find(c => c.includes('Cat')).replace('Cat', '')

            return { title, link, replies, category }
        })

        return threads
    }

    async getTeamRankingDates() {
        const $ = await fetchPage(`${HLTV_URL}/ranking/teams/`)

        const dates = toArray($('.filter-column-content')).reduce((result, datesEl) => {
            const textItems = toArray(datesEl.find('.sidebar-single-line-item')).map(el => el.text().trim())
            const textItemsFormatted = textItems.map(text => text.toLowerCase().replace(/nd|th|st/, ''))
            const headerText = datesEl.prev().text().toLowerCase()

            return {...result, [headerText]: textItemsFormatted}
        }, {})

        return dates
    }

    async getTeamRanking({ year='', month='', day='' } = {}) {
        const $ = await fetchPage(`${HLTV_URL}/ranking/teams/${year}/${month}/${day}`)

        const teams = toArray($('.ranked-team')).map(teamEl => {
            const points = Number(teamEl.find('.points').text().replace(/\(|\)/g, '').split(' ')[0])
            const place = Number(teamEl.find('.position').text().substring(1))
            const team = {
                name: teamEl.find('.name').text(),
                id: Number(teamEl.find('.name').attr('data-url').split('/')[2])
            }
            const change = do {
                if (teamEl.find('.change').text() === '-') {
                    0;
                } else {
                    Number(teamEl.find('.change').text())
                }
            }

            return { points, place, team, change }
        })

        return teams
    }

    async connectToScorebot({ id, onScoreboardUpdate=noop, onLogUpdate=noop, onConnect=noop, onDisconnect=noop }) {
        const $ = await fetchPage(`${HLTV_URL}/matches/${id}/-`)
        const url = $('#scoreboardElement').attr('data-scorebot-url')
        const matchId = $('#scoreboardElement').attr('data-scorebot-id')

        const socket = io.connect(url)

        socket.on('connect', () => {
            onConnect()
            socket.emit('readyForMatch', matchId)
            socket.on('scoreboard', (data) => {
                onScoreboardUpdate(data)
            })
            socket.on('log', (data) => {
                onLogUpdate(data)
            })
        })

        socket.on('reconnect', () => {
            socket.emit('readyForMatch', matchId)
        })

        socket.on('disconnect', () => {
            onDisconnect()
        })
    }
 }

export default new HLTV()
