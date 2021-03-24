import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { BestOfFilter } from '../shared/BestOfFilter'
import { Country } from '../shared/Country'
import { GameMap, toMapFilter } from '../shared/GameMap'
import { MatchType } from '../shared/MatchType'
import { RankingFilter } from '../shared/RankingFilter'
import { Team } from '../shared/Team'
import { fetchPage, generateRandomSuffix, getIdAt, parseNumber } from '../utils'

export interface FullPlayerStats {
  id: number
  name?: string
  ign: string
  image?: string
  age?: number
  country: Country
  team?: Team
  overviewStatistics: {
    kills: number
    headshots: number
    deaths: number
    kdRatio: number
    damagePerRound?: number
    grenadeDamagePerRound?: number
    mapsPlayed: number
    roundsPlayed: number
    killsPerRound: number
    assistsPerRound: number
    deathsPerRound: number
    savedByTeammatePerRound?: number
    savedTeammatesPerRound?: number
    rating1?: number
    rating2?: number
  }
  individualStatistics: {
    roundsWithKills: number
    zeroKillRounds: number
    oneKillRounds: number
    twoKillRounds: number
    threeKillRounds: number
    fourKillRounds: number
    fiveKillRounds: number
    openingKills: number
    openingDeaths: number
    openingKillRatio: number
    openingKillRating: number
    teamWinPercentAfterFirstKill: number
    firstKillInWonRounds: number
    rifleKills: number
    sniperKills: number
    smgKills: number
    pistolKills: number
    grenadeKills: number
    otherKills: number
  }
}

export interface GetPlayerStatsArguments {
  id: number
  startDate?: string
  endDate?: string
  matchType?: MatchType
  rankingFilter?: RankingFilter
  maps?: GameMap[]
  bestOfX?: BestOfFilter
}

export const getPlayerStats = (config: HLTVConfig) => async (
  options: GetPlayerStatsArguments
): Promise<any> => {
  const query = stringify({
    ...(options.startDate ? { startDate: options.startDate } : {}),
    ...(options.endDate ? { endDate: options.endDate } : {}),
    ...(options.matchType ? { matchType: options.matchType } : {}),
    ...(options.rankingFilter ? { rankingFilter: options.rankingFilter } : {}),
    ...(options.maps ? { maps: options.maps.map(toMapFilter) } : {}),
    ...(options.bestOfX ? { bestOfX: options.bestOfX } : {})
  })

  const [$, i$] = await Promise.all([
    fetchPage(
      `https://www.hltv.org/stats/players/${
        options.id
      }/${generateRandomSuffix()}?${query}`,
      config.loadPage
    ).then(HLTVScraper),
    fetchPage(
      `https://www.hltv.org/stats/players/individual/${
        options.id
      }/${generateRandomSuffix()}?${query}`,
      config.loadPage
    ).then(HLTVScraper)
  ])

  const nameText = $('.summaryRealname div').text()
  const name = nameText === '-' ? undefined : nameText
  const ign = $('.context-item-name').text()

  const imageUrl =
    $('.summaryBodyshot').attr('src') || $('.summarySquare').attr('src')
  const image = imageUrl.includes('bodyshot/unknown.png') ? undefined : imageUrl

  const age = $('.summaryPlayerAge').textThen((x) =>
    parseNumber(x.split(' ')[0])
  )

  const country = {
    name: $('.summaryRealname .flag').attr('title')!,
    code: $('.summaryRealname .flag').attrThen(
      'src',
      (x) => x.split('/').pop()?.split('.')[0]!
    )
  }

  const team =
    $('.SummaryTeamname').text() !== 'No team'
      ? {
          name: $('.SummaryTeamname a').text(),
          id: $('.SummaryTeamname a').attrThen('href', getIdAt(3))
        }
      : undefined

  const getOverviewStats = (label: string) => {
    const lbl = label.toLowerCase()
    const row = $('.stats-row').filter((_, x) =>
      x.text().toLowerCase().includes(lbl)
    )
    if (row.exists()) {
      return Number(row.find('span').eq(1).text().replace('%', ''))
    }
  }

  const overviewStatistics = {
    kills: getOverviewStats('Total kills'),
    headshots: getOverviewStats('Headhost %'),
    deaths: getOverviewStats('Total deaths'),
    kdRatio: getOverviewStats('K/D Ratio'),
    damagePerRound: getOverviewStats('Damage / Round'),
    grenadeDamagePerRound: getOverviewStats('Grenade dmg / Round'),
    mapsPlayed: getOverviewStats('Maps played'),
    roundsPlayed: getOverviewStats('Rounds played'),
    killsPerRound: getOverviewStats('Kills / round'),
    assistsPerRound: getOverviewStats('Assists / round'),
    deathsPerRound: getOverviewStats('Deaths / round'),
    savedByTeammatePerRound: getOverviewStats('Saved by teammate'),
    savedTeammatesPerRound: getOverviewStats('Saved teammates'),
    ...(getOverviewStats('Rating 1.0') !== undefined
      ? { rating1: getOverviewStats('Rating 1.0') }
      : { rating2: getOverviewStats('Rating 2.0') })
  }

  const getIndivialStats = (label: string) => {
    const lbl = label.toLowerCase()
    const row = i$('.stats-row').filter((_, x) =>
      x.text().toLowerCase().includes(lbl)
    )
    return Number(row.find('span').eq(1).text().replace('%', ''))
  }

  const individualStatistics = {
    roundsWithKills: getIndivialStats('Rounds with kills'),
    zeroKillRounds: getIndivialStats('0 kill rounds'),
    oneKillRounds: getIndivialStats('1 kill rounds'),
    twoKillRounds: getIndivialStats('2 kill rounds'),
    threeKillRounds: getIndivialStats('3 kill rounds'),
    fourKillRounds: getIndivialStats('4 kill rounds'),
    fiveKillRounds: getIndivialStats('5 kill rounds'),
    openingKills: getIndivialStats('Total opening kills'),
    openingDeaths: getIndivialStats('Total opening deaths'),
    openingKillRatio: getIndivialStats('Opening kill ratio'),
    openingKillRating: getIndivialStats('Opening kill rating'),
    teamWinPercentAfterFirstKill: getIndivialStats(
      'Team win percent after first kill'
    ),
    firstKillInWonRounds: getIndivialStats('First kill in won rounds'),
    rifleKills: getIndivialStats('Rifle kills'),
    sniperKills: getIndivialStats('Sniper kills'),
    smgKills: getIndivialStats('SMG kills'),
    pistolKills: getIndivialStats('Pistol kills'),
    grenadeKills: getIndivialStats('Grenade'),
    otherKills: getIndivialStats('Other')
  }

  return {
    name,
    ign,
    image,
    age,
    country,
    team,
    overviewStatistics,
    individualStatistics
  }
}
