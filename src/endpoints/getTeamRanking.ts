import TeamRanking from '../models/TeamRanking'
import Team from '../models/Team'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray } from '../utils/mappers'

const getTeamRanking = async ({ year='', month='', day='' } = {}): Promise<TeamRanking[]> => {
    const $ = await fetchPage(`${HLTV_URL}/ranking/teams/${year}/${month}/${day}`)

    const teams = toArray($('.ranked-team')).map(teamEl => {
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

export default getTeamRanking
