import {
  FullMatchMapStats,
  TeamStat,
  PlayerStat,
  MatchStatsOverview,
  TeamStatComparison,
  PlayerPerformanceStats,
  PlayerStats,
  PerformanceOverview
} from '../models/FullMatchMapStats'
import { RoundOutcome, WeakRoundOutcome } from '../models/RoundOutcome'
import { Event } from '../models/Event'
import { popSlashSource } from '../utils/parsing'
import { HLTVConfig } from '../config'
import {
  fetchPage,
  toArray,
  getMapSlug,
  mapRoundElementToModel
} from '../utils/mappers'

export type PlayerPerformanceStatsMap = {
  [key: number]: PlayerPerformanceStats
}

export const getMatchMapStats = (config: HLTVConfig) => async ({
  id
}: {
  id: number
}): Promise<FullMatchMapStats> => {
  const getMatchInfoRowValues = (
    $: cheerio.Root,
    index: number
  ): TeamStatComparison => {
    const [stat1, stat2] = $($('.match-info-row').get(index))
      .find('.right')
      .text()
      .split(' : ')
      .map(Number)

    return {
      team1: stat1,
      team2: stat2
    }
  }

  const getPlayerTopStat = (
    $: cheerio.Root,
    index: number
  ): PlayerStat | undefined => {
    const playerHref = $($('.most-x-box').get(index))
      .find('.name > a')
      .attr('href')

    if (!playerHref) {
      return undefined
    }

    return {
      id: Number(playerHref.split('/')[3]),
      name: $($('.most-x-box').get(index)).find('.name > a').text(),
      value: Number($($('.most-x-box').get(index)).find('.valueName').text())
    }
  }

  const [m$, p$] = await Promise.all([
    fetchPage(
      `${config.hltvUrl}/stats/matches/mapstatsid/${id}/-`,
      config.loadPage
    ),
    fetchPage(
      `${config.hltvUrl}/stats/matches/performance/mapstatsid/${id}/-`,
      config.loadPage
    )
  ])

  const matchPageID = Number(m$('.match-page-link').attr('href')!.split('/')[2])
  const matchScore = [
    Number(m$('.team-left .bold').text()),
    Number(m$('.team-right .bold').text())
  ]

  const map = getMapSlug(
    m$(m$('.match-info-box').contents().get(3)).text().replace(/\n| /g, '')
  )

  const date = Number(
    m$('.match-info-box .small-text span').first().attr('data-unix')
  )

  const team1: TeamStat = {
    id: Number(popSlashSource(m$('.team-left .team-logo'))),
    name: m$('.team-left .team-logo').attr('title')!,
    score: matchScore[0]
  }

  const team2: TeamStat = {
    id: Number(popSlashSource(m$('.team-right .team-logo'))),
    name: m$('.team-right .team-logo').attr('title')!,
    score: matchScore[1]
  }

  const event: Event = {
    id: Number(
      m$('.match-info-box .text-ellipsis')
        .first()
        .attr('href')!
        .split('event=')[1]
    ),
    name: m$('.match-info-box .text-ellipsis').first().text()
  }

  const teamStatProperties = ['rating', 'firstKills', 'clutchesWon']
  const teamStats = teamStatProperties.reduce(
    (res, prop, i) => ({ ...res, [prop]: getMatchInfoRowValues(m$, i + 1) }),
    {}
  )

  const mostXProperties = [
    'mostKills',
    'mostDamage',
    'mostAssists',
    'mostAWPKills',
    'mostFirstKills',
    'bestRating'
  ]
  const mostX = mostXProperties.reduce(
    (res, prop, i) => ({ ...res, [prop]: getPlayerTopStat(m$, i) }),
    {}
  )

  const overview = { ...teamStats, ...mostX } as MatchStatsOverview

  const fullRoundHistory: WeakRoundOutcome[] = toArray(
    m$('.round-history-outcome')
  ).map(mapRoundElementToModel(team1.id!, team2.id!))
  const [rh1, rh2] = [
    fullRoundHistory.slice(0, 30),
    fullRoundHistory.slice(30, 60)
  ]

  const roundHistory: RoundOutcome[] = rh1
    .reduce(
      (history, round, i) => history.concat([round, rh2[i]]),
      [] as WeakRoundOutcome[]
    )
    .filter((r) => r.outcome) as RoundOutcome[]

  const playerPerformanceStats: PlayerPerformanceStatsMap = toArray(
    p$('.highlighted-player')
  ).reduce((map, playerEl) => {
    const graphData = playerEl
      .find('.graph.small')
      .attr('data-fusionchart-config')!
    const data = {
      id: Number(playerEl.find('.headline span a').attr('href')!.split('/')[2]),
      killsPerRound: Number(
        graphData.split('Kills per round: ')[1].split('"')[0]
      ),
      deathsPerRound: Number(
        graphData.split('Deaths / round: ')[1].split('"')[0]
      ),
      impact: Number(graphData.split('Impact rating: ')[1].split('"')[0])
    }

    map[data.id] = data

    return map
  }, {})

  const playerOverviewStats: PlayerStats[] = toArray(
    m$('.stats-table tbody tr')
  ).map((rowEl) => {
    const id = Number(rowEl.find('.st-player a').attr('href')!.split('/')[3])
    const performanceStats = playerPerformanceStats[id]

    return {
      id,
      name: rowEl.find('.st-player a').text(),
      kills: Number(rowEl.find('.st-kills').contents().first().text()),
      hsKills: Number(
        rowEl.find('.st-kills .gtSmartphone-only').text().replace(/\(|\)/g, '')
      ),
      assists: Number(rowEl.find('.st-assists').contents().first().text()),
      flashAssists: Number(
        rowEl
          .find('.st-assists .gtSmartphone-only')
          .text()
          .replace(/\(|\)/g, '')
      ),
      deaths: Number(rowEl.find('.st-deaths').text()),
      KAST:
        Number(rowEl.find('.st-kdratio').text().replace('%', '')) || undefined,
      killDeathsDifference: Number(rowEl.find('.st-kddiff').text()),
      ADR: Number(rowEl.find('.st-adr').text()) || undefined,
      firstKillsDifference: Number(rowEl.find('.st-fkdiff').text()),
      rating: Number(rowEl.find('.st-rating').text()),
      ...performanceStats
    } as PlayerStats
  })

  const playerStats = {
    team1: playerOverviewStats.slice(0, 5),
    team2: playerOverviewStats.slice(5)
  }

  const performanceOverview = toArray(p$('.overview-table tr'))
    .slice(1)
    .reduce((res, rowEl) => {
      const stat = rowEl.find('.name-column').text()
      const team1Stat = Number(rowEl.find('.team1-column').text())
      const team2Stat = Number(rowEl.find('.team2-column').text())
      const property = stat.toLowerCase()

      return {
        team1: { ...res.team1, [property]: team1Stat },
        team2: { ...res.team2, [property]: team2Stat }
      }
    }, {} as PerformanceOverview)

  return {
    matchPageID,
    map,
    date,
    team1,
    team2,
    event,
    overview,
    roundHistory,
    playerStats,
    performanceOverview
  }
}
