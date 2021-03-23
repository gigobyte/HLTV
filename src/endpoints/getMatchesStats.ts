import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVPage, HLTVScraper } from '../scraper'
import { fromMapSlug, GameMap } from '../shared/GameMap'
import { Team } from '../shared/Team'
import { Event } from '../shared/Event'
import { fetchPage, getIdAt, sleep } from '../utils'

export enum RankingFilter {
  Top5 = 'Top5',
  Top10 = 'Top10',
  Top20 = 'Top20',
  Top30 = 'Top30',
  Top50 = 'Top50'
}

export enum MatchType {
  LAN = 'Lan',
  Online = 'Online',
  BigEvents = 'BigEvents',
  Majors = 'Majors'
}

export interface GetMatchesStatsArguments {
  startDate?: string
  endDate?: string
  matchType?: MatchType
  maps?: GameMap[]
  rankingFilter?: RankingFilter
  delayBetweenPageRequests?: number
}

export interface MatchStatsPreview {
  mapStatId: number
  date: number
  team1: Team
  team2: Team
  event: Event
  map: GameMap
  result: {
    team1: number
    team2: number
  }
}

export const getMatchesStats = (config: HLTVConfig) => async ({
  startDate,
  endDate,
  matchType,
  maps,
  rankingFilter,
  delayBetweenPageRequests = 0
}: GetMatchesStatsArguments): Promise<any> => {
  const query = stringify({
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    ...(matchType ? { matchType } : {}),
    ...(maps ? { maps } : {}),
    ...(rankingFilter ? { rankingFilter } : {})
  })

  let page = 0
  let $: HLTVPage
  let matches: MatchStatsPreview[] = []

  do {
    await sleep(delayBetweenPageRequests)

    $ = HLTVScraper(
      await fetchPage(
        `https://www.hltv.org/stats/matches?${query}&offset=${page * 50}`,
        config.loadPage
      )
    )

    page++

    matches.push(
      ...$('.matches-table tbody tr')
        .toArray()
        .map((el) => {
          const mapStatId = el.find('.date-col a').attrThen('href', getIdAt(4))!
          const date = el.find('.time').numFromAttr('data-unix')!
          const map = fromMapSlug(el.find('.dynamic-map-name-short').text())

          const team1: Team = {
            id: el.find('.team-col a').first().attrThen('href', getIdAt(3)),
            name: el.find('.team-col a').first().text()
          }

          const team2: Team = {
            id: el.find('.team-col a').last().attrThen('href', getIdAt(3)),
            name: el.find('.team-col a').last().text()
          }

          const event: Event = {
            id: Number(
              el
                .find('.event-col a')
                .attr('href')!
                .split('event=')[1]
                .split('&')[0]
            ),
            name: el.find('.event-col a').text()
          }

          const result = {
            team1: Number(
              el
                .find('.team-col .score')
                .first()
                .trimText()!
                .replace(/\(|\)/g, '')
            ),
            team2: Number(
              el
                .find('.team-col .score')
                .last()
                .trimText()!
                .replace(/\(|\)/g, '')
            )
          }

          return { mapStatId, date, map, team1, team2, event, result }
        })
    )
  } while ($('.matches-table tbody tr').length !== 0)

  return matches
}
