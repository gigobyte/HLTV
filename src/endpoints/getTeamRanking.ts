import { TeamRanking } from '../models/TeamRanking'
import { Team } from '../models/Team'
import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'

export const getTeamRanking = (config: HLTVConfig) => async ({
  year = '',
  month = '',
  day = '',
  country = ''
} = {}): Promise<TeamRanking[]> => {
  let $ = await fetchPage(
    `${config.hltvUrl}/ranking/teams/${year}/${month}/${day}`,
    config.loadPage
  )

  if ((!year || !month || !day) && country) {
    const redirectedLink = $('.ranking-country > a').first().attr('href')!
    const countryRankingLink = redirectedLink
      .split('/')
      .slice(0, -1)
      .concat([country])
      .join('/')

    $ = await fetchPage(
      `${config.hltvUrl}${countryRankingLink}`,
      config.loadPage
    )
  }

  const teams = toArray($('.ranked-team')).map((teamEl) => {
    const points = Number(
      teamEl.find('.points').text().replace(/\(|\)/g, '').split(' ')[0]
    )
    const place = Number(teamEl.find('.position').text().substring(1))

    const team: Team = {
      name: teamEl.find('.name').text(),
      id: Number(teamEl.find('.moreLink').attr('href')!.split('/')[2])
    }

    const changeText = teamEl.find('.change').text()
    const isNew = changeText === 'New'
    const change = changeText === '-' || isNew ? 0 : Number(changeText)

    return { points, place, team, change, isNew }
  })

  return teams
}
