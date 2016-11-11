import cheerio from 'cheerio'
import fetch from 'isomorphic-fetch'

class HLTV {
    _getTeamId($team) {
        const teamLink = $team.attr('href')

        if(teamLink && teamLink !== '#') return teamLink.split('=')[2]
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
            delete match.team1Id
            delete match.live
            delete match.finished
            delete match.map
        } else {
            delete match.label
        }

        if(!match.team1Id) delete match.team1Id
        if(!match.team2Id) delete match.team2Id
    }

    async getMatches() {
        let matches = []
        const response = await fetch('http://www.hltv.org/matches/').then(res => res.text())
        const $ = cheerio.load(response)
        const $matchElems = $('.matchListRow')

        $matchElems.each((i, elem) => {
            const $elem = $(elem)
            const $team1 = $elem.find('.matchTeam1Cell > a')
            const $team2 = $elem.find('.matchTeam2Cell > a')
            const $liveInfo = $($elem.find('.matchScoreCell > div > div'))

            let match = {}

            match.time     = $elem.find('.matchTimeCell').text()
            match.team1    = $team1.text().trim()
            match.team2    = $team2.text().trim()
            match.team1Id  = this._getTeamId($team1)
            match.team2Id  = this._getTeamId($team2)
            match.live     = (match.matchTime === 'LIVE')
            match.finished = (match.matchTime === 'Finished')
            match.format   = $($liveInfo[0]).text().trim()
            match.label    = $elem.find('div[style="text-align: center;width: 80%;float: left;"]').text()
            match.id       = $elem.find('.matchActionCell > a').attr('href').replace('/match/', '')

            this._restructureMatch(match)

            matches.push({...match})
        })

        return matches
    }

    async getLatestResults(pages = 1) {
        if(pages < 1) throw new Error('HLTV.getLatestResults: pages cannot be less than 1')

        let matches = []
        for(let i = 0; i < pages; i++) {
            const response = await fetch(`http://www.hltv.org/results/${i*50}/`).then(res => res.text())
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
}

export default HLTV
