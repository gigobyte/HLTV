import { HLTVConfig } from '../config'
import { HLTVPage, HLTVPageElement, HLTVScraper } from '../scraper'
import { fromMapName, GameMap } from '../shared/GameMap'
import { Team } from '../shared/Team'
import { Event } from '../shared/Event'
import {
  fetchPage,
  generateRandomSuffix,
  getIdAt,
  parseNumber,
  percentageToDecimalOdd
} from '../utils'
import { Player } from '../shared/Player'
import {
  fromFullMatchFormat,
  MatchFormat,
  MatchFormatLocation
} from '../shared/MatchFormat'

export enum MatchStatus {
  Live = 'Live',
  Postponed = 'Postponed',
  Over = 'Over',
  Scheduled = 'Scheduled',
  Deleted = 'Deleted'
}

export interface Demo {
  name: string
  link: string
}

export interface Highlight {
  link: string
  title: string
}

export interface Veto {
  team?: Team
  map: GameMap
  type: 'removed' | 'picked' | 'leftover'
}

export interface HeadToHeadResult {
  date: number
  /** This property is undefined when the match resulted in a draw */
  winner?: Team
  event: Event
  map: GameMap
  result: string
}

export interface ProviderOdds {
  provider: string
  team1: number
  team2: number
}

export interface MapHalfResult {
  team1Rounds: number
  team2Rounds: number
}

export interface MapResult {
  name: GameMap
  result?: {
    team1TotalRounds: number
    team2TotalRounds: number
    halfResults: MapHalfResult[]
  }
  statsId?: number
}

export interface Stream {
  name: string
  link: string
  viewers: number
}

export interface FullMatchTeam extends Team {
  rank?: number
}

export interface FullMatch {
  id: number
  statsId?: number
  title?: string
  date?: number
  significance?: string
  format?: {
    type: MatchFormat
    location?: MatchFormatLocation
  }
  status: MatchStatus
  hasScorebot: boolean
  team1?: FullMatchTeam
  team2?: FullMatchTeam
  winnerTeam?: FullMatchTeam
  vetoes: Veto[]
  event: Event
  odds: ProviderOdds[]
  maps: MapResult[]
  players: {
    team1: Player[]
    team2: Player[]
  }
  streams: Stream[]
  demos: Demo[]
  highlightedPlayers?: {
    team1: Player
    team2: Player
  }
  headToHead: HeadToHeadResult[]
  highlights: Highlight[]
  playerOfTheMatch?: Player
}

export const getMatch =
  (config: HLTVConfig) =>
  async ({ id }: { id: number }): Promise<FullMatch> => {
    const $ = HLTVScraper(
      await fetchPage(
        `https://www.hltv.org/matches/${id}/${generateRandomSuffix()}`,
        config.loadPage
      )
    )

    const title = $('.timeAndEvent .text').trimText()
    const date = $('.timeAndEvent .date').numFromAttr('data-unix')
    const format = getFormat($)
    const significance = getMatchSignificance($)
    const status = getMatchStatus($)
    const hasScorebot = $('#scoreboardElement').exists()
    const statsId = getStatsId($)
    const team1 = getTeam($, 1)
    const team2 = getTeam($, 2)
    const vetoes = getVetoes($, team1, team2)
    const event = getEvent($)
    const odds = getOdds($)
    const oddsCommunity = getCommunityOdds($)
    const maps = getMaps($)
    const players = getPlayers($)
    const streams = getStreams($)
    const demos = getDemos($)
    const highlightedPlayers = getHighlightedPlayers($)
    const headToHead = getHeadToHead($)
    const highlights = getHighlights($, team1, team2)
    const playerOfTheMatch = getPlayerOfTheMatch($, players)
    const winnerTeam = getWinnerTeam($, team1, team2)

    return {
      id,
      statsId,
      significance,
      team1,
      team2,
      winnerTeam,
      date,
      format,
      event,
      maps,
      players,
      streams,
      status,
      title,
      hasScorebot,
      highlightedPlayers,
      playerOfTheMatch,
      headToHead,
      vetoes,
      highlights,
      demos,
      odds: odds.concat(oddsCommunity ? [oddsCommunity] : [])
    }
  }

function getMatchStatus($: HLTVPage): MatchStatus {
  let status = MatchStatus.Scheduled

  switch ($('.countdown').trimText()) {
    case 'LIVE':
      status = MatchStatus.Live
      break
    case 'Match postponed':
      status = MatchStatus.Postponed
      break
    case 'Match deleted':
      status = MatchStatus.Deleted
      break
    case 'Match over':
      status = MatchStatus.Over
      break
  }

  return status
}

function getTeam($: HLTVPage, n: 1 | 2): FullMatchTeam | undefined {
  return $(`.team${n}-gradient`).exists()
    ? {
        name: $(`.team${n}-gradient .teamName`).text(),
        id: $(`.team${n}-gradient a`).attrThen('href', (href) =>
          href ? getIdAt(2, href) : undefined
        ),
        rank: $('.teamRanking a')
          .eq(n - 1)
          .contents()
          .eq(1)
          .textThen((x) => parseNumber(x.replace(/#/g, '')))
      }
    : undefined
}

function getVetoes($: HLTVPage, team1?: Team, team2?: Team): Veto[] {
  const getVeto = (text: string) => {
    const [teamName, map] = text.replace(/^\d. /, '').split(/removed|picked/)

    if (!map || !teamName) {
      return {
        map: fromMapName(text.split(' ')[1]),
        type: 'leftover'
      } as const
    }

    return {
      team: [team1, team2].find((t) => t!.name === teamName.trim())!,
      map: fromMapName(map.trim()),
      type: text.includes('picked') ? 'picked' : 'removed'
    } as const
  }

  if (!team1 || !team2) {
    return []
  }

  // New format
  if ($('.veto-box').length > 1) {
    return $('.veto-box')
      .last()
      .find('.padding div')
      .toArray()
      .map((el) => getVeto(el.text()))
  }

  //Old format
  if ($('.veto-box').first().exists()) {
    const lines = $('.veto-box').first().lines()
    const vetoIndex = lines.findIndex((x) => x.includes('Veto process'))

    if (vetoIndex !== -1) {
      return lines.slice(vetoIndex + 2, lines.length - 1).map(getVeto)
    }
  }

  return []
}

function getEvent($: HLTVPage): Event {
  return {
    name: $('.timeAndEvent .event a').text(),
    id: $('.timeAndEvent .event a').attrThen('href', getIdAt(2))
  }
}

function getOdds($: HLTVPage): ProviderOdds[] {
  return $('tr.provider:not(.hidden)')
    .toArray()
    .filter((el) => el.find('.noOdds').length === 0)
    .map((oddElement) => {
      const convertOdds =
        oddElement.find('.odds-cell').first().text().indexOf('%') >= 0

      const oddTeam1 = Number(
        oddElement.find('.odds-cell').first().find('a').text().replace('%', '')
      )

      const oddTeam2 = Number(
        oddElement.find('.odds-cell').last().find('a').text().replace('%', '')
      )

      return {
        provider: oddElement
          .find('td')
          .first()
          .find('a img')
          .first()
          .attr('title'),
        team1: convertOdds ? percentageToDecimalOdd(oddTeam1) : oddTeam1,
        team2: convertOdds ? percentageToDecimalOdd(oddTeam2) : oddTeam2
      }
    })
}

function getCommunityOdds($: HLTVPage): ProviderOdds | undefined {
  if ($('.pick-a-winner').exists()) {
    return {
      provider: 'community',
      team1: percentageToDecimalOdd(
        Number(
          $('.pick-a-winner-team.team1 > .percentage')
            .first()
            .text()
            .replace('%', '')
        )
      ),
      team2: percentageToDecimalOdd(
        Number(
          $('.pick-a-winner-team.team2 > .percentage')
            .first()
            .text()
            .replace('%', '')
        )
      )
    }
  }
}

function getMaps($: HLTVPage): MapResult[] {
  return $('.mapholder')
    .toArray()
    .map((mapEl) => {
      const team1TotalRounds = Number(
        mapEl.find('.results-left .results-team-score').trimText()
      )

      const team2TotalRounds = Number(
        mapEl.find('.results-right .results-team-score').trimText()
      )

      const statsId = mapEl.find('.results-stats').exists()
        ? mapEl
            .find('.results-stats')
            .attrThen('href', (x) => Number(x.split('/')[4]))
        : undefined

      let result

      if (!isNaN(team1TotalRounds) && !isNaN(team2TotalRounds)) {
        const halfsString = mapEl.find('.results-center-half-score').trimText()!
        let halfs = [
          { team1Rounds: 0, team2Rounds: 0 },
          { team1Rounds: 0, team2Rounds: 0 }
        ]
        if (halfsString) {
          halfs = halfsString
            .split(' ')
            .map((x) => x.replace(/\(|\)|;/g, ''))
            .map((half) => ({
              team1Rounds: Number(half.split(':')[0]),
              team2Rounds: Number(half.split(':')[1])
            }))
        }

        result = {
          team1TotalRounds,
          team2TotalRounds,
          halfResults: halfs
        }
      }

      return {
        name: fromMapName(mapEl.find('.mapname').text()),
        result,
        statsId
      }
    })
}

function getPlayers($: HLTVPage) {
  const getMatchPlayer = (playerEl: HLTVPageElement): Player => {
    return {
      name: playerEl.find('.text-ellipsis').text(),
      id: playerEl.data('player-id')
    }
  }

  return {
    team1: $('div.players')
      .first()
      .find('tr')
      .last()
      .find('.flagAlign')
      .toArray()
      .map(getMatchPlayer),
    team2: $('div.players')
      .eq(1)
      .find('tr')
      .last()
      .find('.flagAlign')
      .toArray()
      .map(getMatchPlayer)
  }
}

function getStreams($: HLTVPage): Stream[] {
  return $('.stream-box')
    .toArray()
    .filter((el) => el.find('.stream-flag').exists())
    .map((streamEl) => ({
      name: streamEl.find('.stream-box-embed').text() || 'VOD',
      link:
        streamEl.data('stream-embed') ||
        streamEl.find('.stream-box-embed').attr('data-stream-embed'),
      viewers: streamEl.find('.viewers.gtSmartphone-only').numFromText() ?? -1
    }))
    .concat(
      $('.stream-box.hltv-live').exists()
        ? [
            {
              name: 'HLTV Live',
              link: $('.stream-box.hltv-live a').attr('href'),
              viewers: -1
            }
          ]
        : []
    )
    .concat(
      $('[data-demo-link-button]').exists()
        ? [
            {
              name: 'GOTV',
              link: `https://www.hltv.org${$('[data-demo-link-button]').data(
                'demo-link'
              )}`,
              viewers: -1
            }
          ]
        : []
    )
}

function getDemos($: HLTVPage): Demo[] {
  return $('[class="stream-box"]:not(:has(.stream-box-embed))')
    .toArray()
    .map(function (demoEl) {
      if (demoEl.attr('data-demo-link')) {
        return { name: 'GOTV Demo', link: demoEl.attr('data-demo-link') }
      }

      return {
        name: demoEl.text(),
        link: demoEl.attr('data-stream-embed')
      }
    })
    .filter((x) => !!x.link)
}

function getHighlightedPlayers($: HLTVPage) {
  const highlightedPlayer1 = $(
    '.lineups-compare-left .lineups-compare-player-links a'
  ).first()

  const highlightedPlayer2 = $(
    '.lineups-compare-right .lineups-compare-player-links a'
  ).first()

  return highlightedPlayer1.exists() && highlightedPlayer2.exists()
    ? {
        team1: {
          name: $('.lineups-compare-left .lineups-compare-playername').text(),
          id: $('.lineups-compare-left .lineups-compare-player-links a')
            .first()
            .attrThen('href', getIdAt(2))
        },
        team2: {
          name: $('.lineups-compare-right .lineups-compare-playername').text(),
          id: $('.lineups-compare-right .lineups-compare-player-links a')
            .first()
            .attrThen('href', getIdAt(2))
        }
      }
    : undefined
}

function getHeadToHead($: HLTVPage): HeadToHeadResult[] {
  return $('.head-to-head-listing tr')
    .toArray()
    .map((matchEl) => {
      const date = Number(matchEl.find('.date a span').attr('data-unix'))
      const map = matchEl.find('.dynamic-map-name-short').text() as GameMap
      const isDraw = !matchEl.find('.winner').exists()

      let winner: Team | undefined

      if (!isDraw) {
        winner = {
          name: matchEl.find('.winner .flag').next().text(),
          id: matchEl.find('.winner .flag').next().attrThen('href', getIdAt(2))
        }
      }

      const event = {
        name: matchEl.find('.event a').text(),
        id: matchEl.find('.event a').attrThen('href', getIdAt(2))
      }

      const result = matchEl.find('.result').text()

      return { date, map, winner, event, result }
    })
}

function getHighlights($: HLTVPage, team1?: Team, team2?: Team): Highlight[] {
  return team1 && team2
    ? $('.highlight')
        .toArray()
        .map((highlightEl) => ({
          link: highlightEl.attr('data-highlight-embed'),
          title: highlightEl.text()
        }))
    : []
}

function getStatsId($: HLTVPage): number | undefined {
  const statsEl = $('.stats-detailed-stats a')

  if (statsEl.exists() && !statsEl.attr('href').includes('mapstats')) {
    return getIdAt(3, $('.stats-detailed-stats a').attr('href'))
  }
}

function getPlayerOfTheMatch(
  $: HLTVPage,
  players: Record<string, Player[]>
): Player | undefined {
  const playerName: string | undefined = $(
    '.highlighted-player .player-nick'
  ).text()

  if (playerName) {
    return (
      players.team1.find((x) => x.name === playerName) ||
      players.team2.find((x) => x.name === playerName)
    )
  }
}

function getWinnerTeam(
  $: HLTVPage,
  team1?: Team,
  team2?: Team
): Team | undefined {
  if ($('.team1-gradient .won').exists()) {
    return team1
  }

  if ($('.team2-gradient .won').exists()) {
    return team2
  }
}

function getFormat($: HLTVPage) {
  if (!$('.preformatted-text').exists()) {
    return
  }

  const [format, location] = $('.preformatted-text')
    .lines()[0]
    .split(' (')
    .map((x) => x.trim())

  return {
    type: fromFullMatchFormat(format),
    location: location?.substring(0, location.length - 1) as MatchFormatLocation
  }
}

function getMatchSignificance($: HLTVPage) {
  const additionalInfo = $('.preformatted-text').lines()
  return additionalInfo
    .find((x) => x.startsWith('*'))
    ?.slice(1)
    .trim()
}
