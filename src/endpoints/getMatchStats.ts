import type { HLTVConfig } from '../config.js'
import { HLTVScraper } from '../scraper.js'
import type { Team } from '../shared/Team.js'
import type { Event } from '../shared/Event.js'
import { fetchPage, generateRandomSuffix, getIdAt } from '../utils.js'
import {
  type MapStatsOverview,
  type TeamsPerformanceOverview,
  type PlayerStats,
  getStatsOverview,
  getPlayerStats,
  getPerformanceOverview
} from './getMatchMapStats.js'

export interface FullMatchStats {
  id: number
  matchId: number
  mapStatIds: number[]
  result: {
    team1MapsWon: number
    team2MapsWon: number
  }
  date: number
  team1: Team
  team2: Team
  event: Event
  overview: MapStatsOverview
  playerStats: {
    team1: PlayerStats[]
    team2: PlayerStats[]
  }
  performanceOverview: TeamsPerformanceOverview
}

export const getMatchStats =
  (config: HLTVConfig) =>
  async ({ id }: { id: number }): Promise<FullMatchStats> => {
    const [m$, p$] = await Promise.all([
      fetchPage(
        `https://www.hltv.org/stats/matches/${id}/${generateRandomSuffix()}`,
        config.loadMatchStatsPage
      ).then(HLTVScraper),
      fetchPage(
        `https://www.hltv.org/stats/matches/${id}/${generateRandomSuffix()}`,
        config.loadMatchStatsPage
      ).then(HLTVScraper)
    ])

    const matchId = m$('.match-page-link').attrThen('href', getIdAt(2))!

    const mapStatIds = m$('.stats-match-map.inactive')
      .toArray()
      .map((el) => el.attrThen('href', getIdAt(4))!)

    const result = {
      team1MapsWon: m$('.team-left .bold').numFromText()!,
      team2MapsWon: m$('.team-right .bold').numFromText()!
    }

    const date = m$('.match-info-box span[data-time-format]').numFromAttr(
      'data-unix'
    )!

    const team1 = {
      id: m$('.team-left a').attrThen('href', getIdAt(3)),
      name: m$('.team-left .team-logo').attr('title')
    }

    const team2 = {
      id: m$('.team-right a').attrThen('href', getIdAt(3)),
      name: m$('.team-right .team-logo').attr('title')
    }

    const event = {
      id: Number(
        m$('.match-info-box .text-ellipsis')
          .first()
          .attr('href')
          ?.split('event=')
          .pop()
      ),
      name: m$('.match-info-box .text-ellipsis').first().text()
    }

    const overview = getStatsOverview(m$)
    const playerStats = getPlayerStats(m$, p$)
    const performanceOverview = getPerformanceOverview(p$)

    return {
      id,
      matchId,
      mapStatIds,
      result,
      date,
      team1,
      team2,
      event,
      overview,
      playerStats,
      performanceOverview
    }
  }
