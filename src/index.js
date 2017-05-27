import cheerio from 'cheerio'
import fetch from 'isomorphic-fetch'

const HLTV_URL = 'http://www.hltv.org'

class ParsingTools {
    _cleanupString(str) {
        if(str.includes('[email protected]')) {
            console.warn('Cannot parse element because of HLTV obfuscation')
        } else {
            return str.replace(/\s\s+/g, ' ').trim()
        }
    }

    _getTeamId($team) {
        const teamLink = $team.attr('href')

        if(teamLink && teamLink !== '#') return parseInt(teamLink.split('=')[2])
    }

    _parseMatchPageMaps($, $maps, $results) {
        let maps = Array.apply(null, Array($maps.length)).map(e => ({}))

        $maps.each((i, map) => {
            maps[i].map = $(map).find('img').attr('src').split('hotmatch/')[1].split('.png')[0]
        })

        $results.each((i, res) => {
            maps[i].result = this._cleanupString($(res).text())
        })

        return maps
    }

    _parseMatchPageStreams($, $streams) {
        return $streams.map((i, e) => ({
            name: this._cleanupString($(e).text()),
            link: HLTV_URL + $(e).find('a').attr('href')
        })).get()
    }

    _parseMatchPagePlayer($) {
        return (i, e) => this._cleanupString($(e).children().first().text())
    }

    _restructureMatch(match) {
        if(['LIVE', 'Finished'].includes(match.time)) {
            delete match.time
        }

        if(!(match.format.includes('Best of'))) {
            match.map = match.format
            match.format = 'Best of 1'
        }

        if(match.label) {
            delete match.team1
            delete match.team1Id
            delete match.team2
            delete match.team2Id
            delete match.live
            delete match.finished
            delete match.map
        } else {
            delete match.label
        }

        if(!match.team1Id) delete match.team1Id
        if(!match.team2Id) delete match.team2Id
    }

    _restructureFullMatch(match) {
        if(match.title) {
            delete match.team1
            delete match.team1Id
            delete match.team2
            delete match.team2Id
            delete match.highlights
            delete match.players
        } else {
            delete match.title
        }
    }

    _getPlayerId(fullIdString) {
        let id = fullIdString.split('playerid=')[1]
        if(!id) {
            id = fullIdString.split('/')[2].split('-')[0]
        }

        return Number(id)
    }
}

class HLTV extends ParsingTools {
    async getMatches() {
        let matches = []
        const response = await fetch(`${HLTV_URL}/matches/`).then(res => res.text())
        const $ = cheerio.load(response)
        const $matchElems = $('.matchListRow')

        $matchElems.each((i, elem) => {
            const $elem = $(elem)
            const $team1 = $elem.find('.matchTeam1Cell > a')
            const $team2 = $elem.find('.matchTeam2Cell > a')
            const $liveInfo = $($elem.find('.matchScoreCell > div > div'))

            let match = {}

            match.time     = $elem.find('.matchTimeCell').text()
            match.eventId  = parseInt($elem.parent().attr('class').split(' ')[1].replace('event_', ''))
            match.team1    = $team1.text().trim()
            match.team2    = $team2.text().trim()
            match.team1Id  = this._getTeamId($team1)
            match.team2Id  = this._getTeamId($team2)
            match.live     = (match.time === 'LIVE')
            match.finished = (match.time === 'Finished')
            match.format   = $($liveInfo[0]).text().trim()
            match.label    = $elem.find('div[style="text-align: center;width: 80%;float: left;"]').text()
            match.id       = Number($elem.find('.matchActionCell > a').attr('href').replace('/match/', '').split('-')[0])

            this._restructureMatch(match)

            matches.push({...match})
        })

        return matches
    }

    async getLatestResults({pages = 1} = {}) {
        if(pages < 1) throw new Error('HLTV.getLatestResults: pages cannot be less than 1')

        let matches = []
        for(let i = 0; i < pages; i++) {
            const response = await fetch(`${HLTV_URL}/results/${i*50}/`).then(res => res.text())
            const $ = cheerio.load(response)
            const $matchElems = $('.matchListRow')

            $matchElems.each((i, elem) => {
                const $elem = $(elem)
                const $team1 = $elem.find('.matchTeam1Cell > a')
                const $team2 = $elem.find('.matchTeam2Cell > a')

                let match = {}

                match.format  = $elem.find('.matchTimeCell').text()
                match.team1   = $team1.text().trim()
                match.team2   = $team2.text().trim()
                match.team1Id = this._getTeamId($team1)
                match.team2Id = this._getTeamId($team2)
                match.id      = $elem.find('.matchActionCell > a').attr('href').replace('/match/', '')
                match.result  = $elem.find('.matchScoreCell').text().trim()

                this._restructureMatch(match)

                matches.push({...match})
            })
        }

        return matches
    }

    async getStreams({loadLinks = false} = {}) {
        let streams = []
        const response = await fetch(HLTV_URL).then(res => res.text())
        const $ = cheerio.load(response)
        const $unparsedStreams = $('a.col-box.streamer.a-reset')

        for(let i = 0; i < $unparsedStreams.length; i++) {
            let stream = {}

            const $streamObj = $($unparsedStreams[i])

            stream.name     = $streamObj.attr('title')
            stream.viewers  = parseInt($streamObj.clone().children().remove().end().text().replace(/[()]/g, ''));
            stream.category = $($streamObj.find('img')[0]).attr('title')
            stream.country  = $($streamObj.find('img')[1]).attr('title')
            stream.hltvLink = HLTV_URL + $streamObj.attr('href')

            if(loadLinks) {
                const hltvPage = await fetch(stream.hltvLink).then(res => res.text())

                stream.realLink = cheerio.load(hltvPage)('iframe').attr('src')
            }

            streams.push({...stream})
        }

        return streams
    }

    async getMatch({id} = {}) {
        let match = {
            event: {},
            players: []
        }

        const response = await fetch(`${HLTV_URL}/match/${id}-`).then(res => res.text())
        const $ = cheerio.load(response)

        const $teams = $('div[style*="width:46%;"]')
        const $eventInfo = $('div[style*="font-size: 18px;"]')
        const $mapFormatBox = $('#mapformatbox')
        const $maps = $('div[style*="width:280px;"]')
        const $mapResults = $('div[style*="width:270px;"]')
        const $highlights = $('.hotmatchroundbox').has('div[style="cursor:pointer;color:#0269D2"]')
        const $streams = $('.hotmatchroundbox').has('div[style="cursor:pointer;width:240px;"]')
        const $players = $('div[style*="width:105px;"]')
        const $playerHighlight = $('.headertext').find('a > b')

        const $team1 = $($teams[0]).find('span > a')
        const $team2 = $($teams[1]).find('span > a')

        match.team1 = $team1.text().trim()
        match.team2 = $team2.text().trim()
        match.team1Id = this._getTeamId($team1)
        match.team2Id = this._getTeamId($team2)
        match.date = this._cleanupString($($eventInfo[0]).text())

        match.event.name = $eventInfo.find('a').text()
        match.event.link = HLTV_URL + $eventInfo.find('a').attr('href')
        match.format = $mapFormatBox.text().split('\n')[1].trim()

        match.maps = this._parseMatchPageMaps($, $maps, $mapResults)
        match.streams = this._parseMatchPageStreams($, $streams)
        match.highlights = $highlights.map((i, e) => this._cleanupString($(e).text())).get()

        match.players[0] = $players.slice(0,5).map(this._parseMatchPagePlayer($)).get()
        match.players[1] = $players.slice(5,10).map(this._parseMatchPagePlayer($)).get()

        if($mapFormatBox.text().split('\n').length > 3) {
            match.additionalInfo = $mapFormatBox.text().split('\n')[3].trim()
        }

        if($playerHighlight.text()) {
            match.playerHighlight = {
                playerName: $playerHighlight.text().slice(1, -1),
                playerId: this._getPlayerId($playerHighlight.parent().attr('href'))
            }
        }

        match.title = this._cleanupString($('span[style*="font-size: 26px"] > span').text())

        this._restructureFullMatch(match)

        return match
    }

    async getActiveThreads() {
        let threads = []

        const response = await fetch(HLTV_URL).then(res => res.text())
        const $ = cheerio.load(response)

        const $threadsArray = $('.activitylist').children();

        for(let i = 0; i < $threadsArray.length; i++) {
            const $thread = $($threadsArray[i])
            threads[i] = {
                title: $thread.find('span').text(),
                link: $thread.attr('href'),
                replies: parseInt($thread.clone().children().remove().end().text().replace(/[()]/g, ''))
            }
        }
        return threads
    }
}

export default HLTV
