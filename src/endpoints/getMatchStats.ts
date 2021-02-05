import {
  FullMatchStats,
  TeamStat,
  PlayerStat,
  PlayerStats,
  MatchStatsOverview,
  TeamStatComparison
} from '../models/FullMatchStats'
import { Event } from '../models/Event'
import { HLTVConfig } from '../config'
import { fetchPage, generateRandomSuffix, toArray } from '../utils/mappers'
import { checkForRateLimiting } from '../utils/checkForRateLimiting'

export const getMatchStats = (config: HLTVConfig) => async ({
  id
}: {
  id: number
}): Promise<FullMatchStats> => {
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

  const getPlayerTopStat = ($: cheerio.Root, index: number): PlayerStat => {
    return {
      id: Number(
        $($('.most-x-box').get(index))
          .find('.name > a')
          .attr('href')!
          .split('/')[3]
      ),
      name: $($('.most-x-box').get(index)).find('.name > a').text(),
      value: Number($($('.most-x-box').get(index)).find('.valueName').text())
    }
  }

  const $ = await fetchPage(
    `${config.hltvUrl}/stats/matches/${id}/${generateRandomSuffix()}`,
    config.loadPage
  )

  checkForRateLimiting($)

  const matchPageID = Number($('.match-page-link').attr('href')!.split('/')[2])
  const matchScore = [
    Number($('.team-left .bold').text()),
    Number($('.team-right .bold').text())
  ]
  const date = Number(
    $('.match-info-box .small-text span').first().attr('data-unix')
  )

  const team1: TeamStat = {
    id: Number($('.team-left a.block').attr('href')!.split('/')[3]),
    name: $('.team-left .team-logo').attr('title')!,
    score: matchScore[0]
  }

  const team2: TeamStat = {
    id: Number($('.team-right a.block').attr('href')!.split('/')[3]),
    name: $('.team-right .team-logo').attr('title')!,
    score: matchScore[1]
  }

  const event: Event = {
    id: Number(
      $('.match-info-box .text-ellipsis')
        .first()
        .attr('href')!
        .split('event=')[1]
    ),
    name: $('.match-info-box .text-ellipsis').first().text()
  }

  const teamStatProperties = ['rating', 'firstKills', 'clutchesWon']
  const teamStats = teamStatProperties.reduce(
    (res, prop, i) => ({ ...res, [prop]: getMatchInfoRowValues($, i) }),
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
    (res, prop, i) => ({ ...res, [prop]: getPlayerTopStat($, i) }),
    {}
  )

  const overview = { ...teamStats, ...mostX } as MatchStatsOverview
  const playerOverviewStats: PlayerStats[] = toArray(
    $('.stats-table tbody tr')
  ).map((rowEl) => {
    const id = Number(rowEl.find('.st-player a').attr('href')!.split('/')[3])

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
      KAST: Number(rowEl.find('.st-kdratio').text().replace('%', '')),
      killDeathsDifference: Number(rowEl.find('.st-kddiff').text()),
      ADR: Number(rowEl.find('.st-adr').text()),
      firstKillsDifference: Number(rowEl.find('.st-fkdiff').text()),
      rating: Number(rowEl.find('.st-rating').text())
    }
  })

  const playerStats = {
    team1: playerOverviewStats.slice(0, 5),
    team2: playerOverviewStats.slice(5)
  }

  return {
    matchPageID,
    date,
    team1,
    team2,
    event,
    overview,
    playerStats
  }
}
