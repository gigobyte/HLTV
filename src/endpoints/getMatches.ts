import { UpcomingMatch } from '../models/UpcomingMatch'
import { LiveMatch } from '../models/LiveMatch'
import { Event } from '../models/Event'
import { Team } from '../models/Team'
import { popSlashSource } from '../utils/parsing'
import { HLTVConfig } from '../config'
import { fetchPage, toArray, getMatchFormatAndMap } from '../utils/mappers'

export const getMatches = (config: HLTVConfig) => async (): Promise<
  (UpcomingMatch | LiveMatch)[]
> => {
  const $ = await fetchPage(`${config.hltvUrl}/matches`, config.loadPage)

  const liveMatches: LiveMatch[] = toArray($('.liveMatch .a-reset')).map((matchEl) => {
    const id = Number(matchEl.attr('href')!.split('/')[2])
    const teamEls = matchEl.find('img.matchTeamLogo')
    const stars = matchEl.find('.matchRating i').length

    const team1: Team = {
      name: teamEls.first().attr('title')!,
      id: Number(popSlashSource(teamEls.first())) || undefined,
    }

    const team2: Team = {
      name: teamEls.last().attr('title')!,
      id: Number(popSlashSource(teamEls.last())) || undefined,
    }

    const format = matchEl.find('.matchMeta').text()

    const event: Event = {
      name: matchEl.find('.matchEventLogo').attr('title')!,
      id: Number(popSlashSource(matchEl.find('.matchEventLogo'))!.split('.')[0]) || undefined,
    }

    return { id, team1, team2, event, format, stars, live: true }
  })

  const upcomingMatches: UpcomingMatch[] = toArray($('.upcomingMatch ')).map((matchEl) => {
    const link = matchEl.find('.a-reset')
    const id = Number(link.attr('href')!.split('/')[2])
    const date = Number(matchEl.find('.matchTime').attr('data-unix')) || undefined
    const title = matchEl.find('.matchInfoEmpty').text() || undefined
    const stars = matchEl.find('.matchRating i').length

    const format = matchEl.find('.matchMeta').text()

    let event: Event | undefined
    let team1: Team | undefined
    let team2: Team | undefined

    if (!title) {
      team1 = {
        name: matchEl.find('.team1 .matchTeamName').text(),
        id: Number(popSlashSource(matchEl.find('.team1 .matchTeamLogo'))) || undefined,
      }

      team2 = {
        name: matchEl.find('.team2 .matchTeamName').text() || matchEl.find('.team2 .team').text(),
        id: matchEl.find('.team2 .matchTeamLogo').length
          ? Number(popSlashSource(matchEl.find('.team2 .matchTeamLogo'))) || undefined
          : undefined,
      }
      event = {
        name: matchEl.find('.matchEventLogo').attr('alt')!,
        id: Number(popSlashSource(matchEl.find('.matchEventLogo'))!.split('.')[0]) || undefined,
      }
    }

    return { id, date, team1, team2, format, title, event, stars, live: false }
  })

  return [...liveMatches, ...upcomingMatches]
}
