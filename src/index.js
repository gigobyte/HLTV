import cheerio from 'cheerio'
import fetch from 'isomorphic-fetch'

const HLTV_URL = 'http://www.hltv.org'

const toArray = elements => elements.toArray().map(cheerio)

class HLTV {
    async getMatch({ id }) {
        const response = await fetch(`${HLTV_URL}/matches/${id}/-`).then(res => res.text())
        const $ = cheerio.load(response)

        const teamEls = toArray($('div.teamName'))

        const [ team1, team2 ] = teamEls.map(el => el.text())
        const [ team1Id, team2Id ] = teamEls.map(el => el.prev()).map(logo => logo.attr('src').split('/').pop())

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
 }

export default new HLTV()
