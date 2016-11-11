import cheerio from 'cheerio'
import fetch from 'isomorphic-fetch'

class HLTV {
    static async getMatches() {
        let matches = []
        const response = await fetch('http://www.hltv.org/matches/').then(res => res.text())
        const $ = cheerio.load(response)
        const $matchElems = $('.matchListRow')

        $matchElems.each((i, elem) => {
            const $elem = $(elem)
            const $team1 = $elem.find('.matchTeam1Cell > a')
            const $team2 = $elem.find('.matchTeam2Cell > a')

            let match = {}

            match.matchTime = $elem.find('.matchTimeCell').text()
            match.team1 = $team1.text().trim()
            match.team2 = $team2.text().trim()

            const team1Link = $team1.attr('href')
            const team2Link = $team2.attr('href')

            if(team1Link && team1Link !== '#') {
                match.team1Id = team1Link.split('=')[2]
            }

            if(team2Link && team2Link !== '#') {
                match.team2Id = team2Link.split('=')[2]
            }

            match.live = (match.matchTime === 'LIVE' && delete match.matchTime)
            match.finished = (match.matchTime === 'Finished' && delete match.matchTime)

            const $liveInfo = $($elem.find('.matchScoreCell > div > div'))
            const format = $($liveInfo[0]).text().trim()

            if(format.includes('Best of')) {
                match.format = format
            } else {
                match.map = format
                match.format = 'Best of 1'
            }

            const matchLabel = $elem.find('div[style="text-align: center;width: 80%;float: left;"]').text()

            if(matchLabel) {
                match.matchLabel = matchLabel
                delete match.team1
                delete match.team2
                delete match.map    
            }

            match.id = $elem.find('.matchActionCell > a').attr('href').replace('/match/', '')

            matches.push({...match})
        })

        return matches
    }
}

export default HLTV
