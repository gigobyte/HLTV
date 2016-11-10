import cheerio from 'cheerio'
import fetch from 'isomorphic-fetch'

class HLTVMatchSummary {
    constructor($elem) {
        this.matchTime = $elem.find('.matchTimeCell').text()
        this.team1 = $elem.find('.matchTeam1Cell').text().trim()
        this.team2 = $elem.find('.matchTeam2Cell').text().trim()
        this.live = (this.matchTime === 'LIVE')
        this.finished = (this.matchTime === 'Finished')

        this.$score = $elem.find('.matchScoreCell')
        this._extractScore()
    }

    _extractScore() {

    }
}

class HLTV {
    //getMatches :: () -> [HLTVMatchSummary]
    static async getMatches() {
        const response = await fetch('http://www.hltv.org/matches/').then(res => res.text())
        const $ = cheerio.load(response)
        const $matchElems = $('.matchListRow')

        return $matchElems.map(e => new HLTVMatchSummary($(e)))
    }
}

export default HLTV
