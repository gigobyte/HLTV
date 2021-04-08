import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Team } from '../shared/Team'
import { Event } from '../shared/Event'
import { fetchPage, getIdAt } from '../utils'

export enum MatchEventType {
  All = 'All',
  LAN = 'Lan',
  Online = 'Online'
}

export enum MatchFilter {
  LanOnly = 'lan_only',
  TopTier = 'top_tier'
}

export interface GetMatchesArguments {
  eventId?: number
  eventType?: MatchEventType
  filter?: MatchFilter
}

export interface MatchPreview {
  id: number
  team1?: Team
  team2?: Team
  date?: number
  format?: string
  event?: Event
  title?: string
  live: boolean
  stars: number
}

export const getMatches = (config: HLTVConfig) => async ({
  eventId,
  eventType,
  filter
}: GetMatchesArguments = {}): Promise<MatchPreview[]> => {
  const query = stringify({
    ...(eventId ? { event: eventId } : {}),
    ...(eventType ? { eventType } : {}),
    ...(filter ? { predefinedFilter: filter } : {})
  })

  const $ = HLTVScraper(
    await fetchPage(`https://www.hltv.org/matches?${query}`, config.loadPage)
  )

  const events = $('.event-filter-popup a')
    .toArray()
    .map((el) => ({
      id: el.attrThen('href', (x) => Number(x.split('=').pop())),
      name: el.find('.event-name').text()
    }))

  return $('.liveMatch-container')
    .toArray()
    .concat($('.upcomingMatch').toArray())
    .map((el) => {
      const id = el.find('.a-reset').attrThen('href', getIdAt(2))!
      const stars = 5 - el.find('.matchRating i.faded').length
      const live = el.find('.matchTime.matchLive').text() === 'LIVE'
      const title = el.find('.matchInfoEmpty').text() || undefined

      const date = el.find('.matchTime').numFromAttr('data-unix')

      let team1
      let team2

      if (!title) {
        team1 = {
          name:
            el.find('.matchTeamName').first().text() ||
            el.find('.team1 .team').text(),
          id: el.numFromAttr('team1'),
          logo: el.find('.matchTeamLogo').first().attr('src')
        }

        team2 = {
          name:
            el.find('.matchTeamName').eq(1).text() ||
            el.find('.team2 .team').text(),
          id: el.numFromAttr('team2'),
          logo: el.find('.matchTeamLogo').eq(1).attr('src')
        }
      }

      const format = el.find('.matchMeta').text()

      const eventName = el.find('.matchEventLogo').attr('title')
      const event = events.find((x) => x.name === eventName)

      return { id, date, stars, title, team1, team2, format, event, live }
    })
}
