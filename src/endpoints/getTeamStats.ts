import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVPage, HLTVPageElement, HLTVScraper } from '../scraper'
import { BestOfFilter } from '../shared/BestOfFilter'
import { fromMapName, GameMap, toMapFilter } from '../shared/GameMap'
import { MatchType } from '../shared/MatchType'
import { Player } from '../shared/Player'
import { Event } from '../shared/Event'
import { RankingFilter } from '../shared/RankingFilter'
import { fetchPage, generateRandomSuffix, getIdAt } from '../utils'
import { MatchStatsPreview } from './getMatchesStats'

export interface TeamMapStats {
  wins: number
  draws: number
  losses: number
  winRate: number
  totalRounds: number
  roundWinPAfterFirstKill: number
  roundWinPAfterFirstDeath: number
}

export interface TeamStatsEvent {
  place: string
  event: Event
}

export interface FullTeamStats {
  id: number
  name: string
  overview: {
    mapsPlayed: number
    wins: number
    draws: number
    losses: number
    totalKills: number
    totalDeaths: number
    roundsPlayed: number
    kdRatio: number
  }
  currentLineup: Player[]
  historicPlayers: Player[]
  standins: Player[]
  substitutes: Player[]
  matches: MatchStatsPreview[]
  mapStats: Record<GameMap, TeamMapStats>
  events: TeamStatsEvent[]
}

export interface GetTeamStatsArguments {
  id: number
  currentRosterOnly?: boolean
  startDate?: string
  endDate?: string
  matchType?: MatchType
  rankingFilter?: RankingFilter
  maps?: GameMap[]
  bestOfX?: BestOfFilter
}

export const getTeamStats =
  (config: HLTVConfig) =>
  async (options: GetTeamStatsArguments): Promise<FullTeamStats> => {
    const query = stringify({
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {}),
      ...(options.matchType ? { matchType: options.matchType } : {}),
      ...(options.rankingFilter
        ? { rankingFilter: options.rankingFilter }
        : {}),
      ...(options.maps ? { maps: options.maps.map(toMapFilter) } : {}),
      ...(options.bestOfX ? { bestOfX: options.bestOfX } : {})
    })

    let $ = HLTVScraper(
      await fetchPage(
        `https://www.hltv.org/stats/teams/${options.id}/-?${query}`,
        config.loadPage
      )
    )

    const name = $('.context-item-name').last().text()
    const currentTeam = { id: options.id, name }

    const currentLineup = getPlayersByContainer(
      getContainerByText($, 'Current lineup')
    )

    const currentRosterQuery = stringify({
      lineup: currentLineup.map((x) => x.id!),
      minLineupMatch: 0
    })

    if (options.currentRosterOnly) {
      $ = HLTVScraper(
        await fetchPage(
          `https://www.hltv.org/stats/lineup?${currentRosterQuery}`,
          config.loadPage
        )
      )
    }

    const historicPlayers = getPlayersByContainer(
      getContainerByText($, 'Historic players')
    )

    const substitutes = getPlayersByContainer(
      getContainerByText($, 'Substitutes')
    )

    const standins = getPlayersByContainer(getContainerByText($, 'Standins'))

    const [m$, e$, mp$] = await Promise.all([
      fetchPage(
        options.currentRosterOnly
          ? `https://www.hltv.org/stats/lineup/matches?${currentRosterQuery}&${query}`
          : `https://www.hltv.org/stats/teams/matches/${
              options.id
            }/${generateRandomSuffix()}?${query}`,
        config.loadPage
      ).then(HLTVScraper),
      fetchPage(
        options.currentRosterOnly
          ? `https://www.hltv.org/stats/lineup/events?${currentRosterQuery}&${query}`
          : `https://www.hltv.org/stats/teams/events/${
              options.id
            }/${generateRandomSuffix()}?${query}`,
        config.loadPage
      ).then(HLTVScraper),
      fetchPage(
        options.currentRosterOnly
          ? `https://www.hltv.org/stats/lineup/maps?${currentRosterQuery}&${query}`
          : `https://www.hltv.org/stats/teams/maps/${
              options.id
            }/${generateRandomSuffix()}?${query}`,
        config.loadPage
      ).then(HLTVScraper)
    ])

    const overviewStats = $('.standard-box .large-strong')

    const [wins, draws, losses] = overviewStats
      .eq(1)
      .text()
      .split('/')
      .map(Number)

    const overview = {
      mapsPlayed: overviewStats.eq(0).numFromText()!,
      totalKills: overviewStats.eq(2).numFromText()!,
      totalDeaths: overviewStats.eq(3).numFromText()!,
      roundsPlayed: overviewStats.eq(4).numFromText()!,
      kdRatio: overviewStats.eq(5).numFromText()!,
      wins,
      draws,
      losses
    }

    const matches = m$('.stats-table tbody tr')
      .toArray()
      .map((el) => {
        const [team1Result, team2Result] = el
          .find('.statsDetail')
          .text()
          .split(' - ')

        return {
          date: getTimestamp(el.find('.time a').text()),
          event: {
            id: Number(
              el
                .find('.image-and-label')
                .attr('href')!
                .split('event=')[1]
                .split('&')[0]
            ),
            name: el.find('.image-and-label img').attr('title')!
          },
          team1: currentTeam,
          team2: {
            id: el.find('img.flag').parent().attrThen('href', getIdAt(3)),
            name: el.find('img.flag').parent().trimText()!
          },
          map: fromMapName(el.find('.statsMapPlayed').text()),
          mapStatsId: el.find('.time a').attrThen('href', getIdAt(4))!,
          result: { team1: Number(team1Result), team2: Number(team2Result) }
        }
      })

    const events = e$('.stats-table tbody tr')
      .toArray()
      .map((el) => {
        const eventEl = el.find('.image-and-label').first()

        return {
          place: el.find('.statsCenterText').text(),
          event: {
            id: Number(eventEl.attr('href')!.split('event=')[1].split('&')[0]),
            name: eventEl.text()
          }
        }
      })

    const getMapStat = (mapEl: HLTVPageElement, i: number) =>
      mapEl.find('.stats-row').eq(i).children().last().text()

    const mapStats = mp$('.two-grid .col .stats-rows')
      .toArray()
      .reduce((stats, mapEl) => {
        const mapName = fromMapName(
          mapEl.prev().find('.map-pool-map-name').text()
        )

        const [wins, draws, losses] = getMapStat(mapEl, 0)
          .split(' / ')
          .map(Number)

        stats[mapName] = {
          wins,
          draws,
          losses,
          winRate: Number(getMapStat(mapEl, 1).split('%')[0]),
          totalRounds: Number(getMapStat(mapEl, 2)),
          roundWinPAfterFirstKill: Number(getMapStat(mapEl, 3).split('%')[0]),
          roundWinPAfterFirstDeath: Number(getMapStat(mapEl, 4).split('%')[0])
        }

        return stats
      }, {} as Record<string, any>)

    return {
      id: options.id,
      name,
      overview,
      matches,
      currentLineup,
      historicPlayers,
      standins,
      substitutes,
      events,
      mapStats
    }
  }

function getContainerByText($: HLTVPage, text: string) {
  return $('.standard-headline')
    .filter((_, el) => el.text() === text)
    .parent()
    .next()
}

function getPlayersByContainer(container: HLTVPageElement) {
  return container
    .find('.image-and-label')
    .toArray()
    .map((el) => ({
      id: el.attrThen('href', getIdAt(3)),
      name: el.find('.text-ellipsis').text()
    }))
}

function getTimestamp(source: string): number {
  const [day, month, year] = source.split('/')

  return new Date([month, day, year].join('/')).getTime()
}
