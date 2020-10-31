import { FullMatch } from '../models/FullMatch'
import { Event } from '../models/Event'
import { MapResult } from '../models/MapResult'
import { OddResult, CommunityOddResult } from '../models/OddResult'
import { Player } from '../models/Player'
import { Stream } from '../models/Stream'
import { Team } from '../models/Team'
import { Demo } from '../models/Demo'
import { Highlight } from '../models/Highlight'
import { Veto } from '../models/Veto'
import { HeadToHeadResult } from '../models/HeadToHeadResult'
import { MapSlug } from '../enums/MapSlug'
import { MatchStatus } from '../enums/MatchStatus'
import { hasChild, hasNoChild, percentageToDecimalOdd } from '../utils/parsing'
import { HLTVConfig } from '../config'
import {
  fetchPage,
  toArray,
  mapVetoElementToModel,
  getMapSlug,
  getMatchPlayer
} from '../utils/mappers'

const getTeamId = (el: cheerio.Cheerio): number | undefined => {
  if (el.find('a').length) {
    return Number(el.find('a').first().attr('href')!.split('/')[2])
  }

  return undefined
}

export const getMatch = (config: HLTVConfig) => async ({
  id
}: {
  id: number
}): Promise<FullMatch> => {
  const $ = await fetchPage(
    `${config.hltvUrl}/matches/${id}/-`,
    config.loadPage
  )

  const title = $('.timeAndEvent .text').text().trim() || undefined
  const date = Number($('.timeAndEvent .date').attr('data-unix'))
  const format = $('.preformatted-text').text().split('\n')[0]
  const additionalInfo = $('.preformatted-text')
    .text()
    .split('\n')
    .slice(1)
    .join(' ')
    .trim()

  let status = MatchStatus.Scheduled
  if (!$('.countdown').attr('data-time-countdown')) {
    status = $('.countdown').text() as MatchStatus
  } else if ($('.countdown').text() === MatchStatus.Live) {
    status = MatchStatus.Live
  }

  const live = status === MatchStatus.Live
  const hasScorebot = $('#scoreboardElement').length !== 0
  const teamEls = $('div.teamsBox div.team')

  const team1: Team | undefined = teamEls
    .first()
    .find('div.teamName')
    .first()
    .text()
    ? {
        name: teamEls.first().find('div.teamName').first().text(),
        id: getTeamId(teamEls.first())
      }
    : undefined

  const team2: Team | undefined = teamEls
    .last()
    .find('div.teamName')
    .first()
    .text()
    ? {
        name: teamEls.last().find('div.teamName').first().text(),
        id: getTeamId(teamEls.last())
      }
    : undefined

  let winnerTeam: Team | undefined

  if ($('.team1-gradient').children().last().hasClass('won')) {
    winnerTeam = team1
  }

  if ($('.team2-gradient').children().last().hasClass('won')) {
    winnerTeam = team2
  }

  let vetoes: Veto[] | undefined

  if (team1 && team2) {
    vetoes = toArray($('.veto-box').last().find('.padding > div'))
      .slice(0, -1)
      .map((el) => mapVetoElementToModel(el, team1, team2))
  }

  const event: Event = {
    name: $('.timeAndEvent .event').text(),
    id: Number(
      $('.timeAndEvent .event').children().first().attr('href')!.split('/')[2]
    )
  }

  const odds: OddResult[] = toArray(
    $('[class^="world"] tr.provider:not(.hidden)')
  )
    .filter(hasNoChild('.noOdds'))
    .map((oddElement) => {
      let convertOdds =
        oddElement.find('.odds-cell').first().text().indexOf('%') >= 0
          ? true
          : false

      let oddTeam1 = Number(
        oddElement.find('.odds-cell').first().find('a').text().replace('%', '')
      )

      let oddTeam2 = Number(
        oddElement.find('.odds-cell').last().find('a').text().replace('%', '')
      )

      if (convertOdds) {
        oddTeam1 = percentageToDecimalOdd(oddTeam1)
        oddTeam2 = percentageToDecimalOdd(oddTeam2)
      }

      return {
        provider: oddElement
          .prop('class')
          .split('gprov_')[1]
          .split(' ')[0]
          .trim(),
        team1: oddTeam1,
        team2: oddTeam2
      }
    })

  let oddsCommunity: CommunityOddResult | undefined

  if ($('.pick-a-winner-team').length == 2) {
    oddsCommunity = {
      team1: percentageToDecimalOdd(
        Number(
          $('.pick-a-winner-team')
            .first()
            .find('.percentage')
            .text()
            .replace('%', '')
        )
      ),
      team2: percentageToDecimalOdd(
        Number(
          $('.pick-a-winner-team')
            .last()
            .find('.percentage')
            .text()
            .replace('%', '')
        )
      )
    }
  }

  const maps: MapResult[] = toArray($('.mapholder')).map((mapEl) => {
    const team1Rounds = mapEl
      .find('.results-left .results-team-score')
      .text()
      .trim()
    const team2Rounds = mapEl
      .find('.results-right .results-team-score')
      .text()
      .trim()
    const halfs = mapEl.find('.results-center-half-score').text().trim()

    return {
      name: getMapSlug(mapEl.find('.mapname').text()),
      result: team1Rounds
        ? `${team1Rounds}:${team2Rounds} ${halfs}`
        : undefined,
      statsId: mapEl.find('.results-stats').length
        ? Number(mapEl.find('.results-stats').attr('href')!.split('/')[4])
        : undefined
    }
  })

  let players: { team1: Player[]; team2: Player[] } | undefined

  if (team1 && team2) {
    players = {
      team1: toArray(
        $('div.players').first().find('tr').last().find('.flagAlign')
      ).map(getMatchPlayer),
      team2: toArray(
        $('div.players').last().find('tr').last().find('.flagAlign')
      ).map(getMatchPlayer)
    }
  }

  let streams: Stream[] = toArray($('.stream-box-embed'))
    .filter(hasChild('.flagAlign'))
    .map((streamEl) => ({
      name: streamEl.find('.flagAlign').text(),
      link: streamEl.attr('data-stream-embed')!,
      viewers: Number(streamEl.find('.viewers').text())
    }))

  if ($('.stream-box.hltv-live').length !== 0) {
    streams.push({
      name: 'HLTV Live',
      link: $('.stream-box.hltv-live a').attr('href')!,
      viewers: 0
    })
  }

  if ($('.stream-box.gotv').length !== 0) {
    streams.push({
      name: 'GOTV',
      link: $('.stream-box.gotv').text().replace('GOTV: connect', '').trim(),
      viewers: 0
    })
  }

  const demos: Demo[] = toArray(
    $('div[class="stream-box"]:not(:has(.stream-box-embed))')
  )
    .map((demoEl) => {
      const gotvEl = demoEl.find('.left-right-padding')

      if (gotvEl.length !== 0) {
        return { name: gotvEl.text(), link: gotvEl.attr('href')! }
      }

      return {
        name: demoEl.find('.spoiler').text(),
        link: demoEl.attr('data-stream-embed')!
      }
    })
    .filter((x) => !!x.link)

  const highlightedPlayerLink: string | undefined = $('.highlighted-player')
    .find('.flag')
    .next()
    .attr('href')

  const highlightedPlayer: Player | undefined = highlightedPlayerLink
    ? {
        name: highlightedPlayerLink.split('/').pop()!,
        id: Number(highlightedPlayerLink.split('/')[2])
      }
    : undefined

  let headToHead: HeadToHeadResult[] | undefined

  if (team1 && team2) {
    headToHead = toArray($('.head-to-head-listing tr')).map((matchEl) => {
      const date = Number(matchEl.find('.date a span').attr('data-unix'))
      const map = matchEl.find('.dynamic-map-name-short').text() as MapSlug
      const isDraw = matchEl.find('.winner').length === 0

      let winner: Team | undefined

      if (!isDraw) {
        winner = {
          name: matchEl.find('.winner .flag').next().text(),
          id: Number(
            matchEl.find('.winner .flag').next().attr('href')!.split('/')[2]
          )
        }
      }

      const event = {
        name: matchEl.find('.event a').text(),
        id: Number(matchEl.find('.event a').attr('href')!.split('/')[2])
      }

      const result = matchEl.find('.result').text()

      return { date, map, winner, event, result }
    })
  }

  let highlights: Highlight[] | undefined

  if (team1 && team2) {
    highlights = toArray($('.highlight')).map((highlightEl) => ({
      link: highlightEl.attr('data-highlight-embed')!,
      title: highlightEl.text()
    }))
  }

  let statsId: number | undefined

  if ($('.stats-detailed-stats a').length) {
    const matchStatsHref = $('.stats-detailed-stats a').attr('href')!

    statsId =
      matchStatsHref.split('/')[3] !== 'mapstatsid'
        ? parseInt(matchStatsHref.split('/')[3], 10)
        : parseInt(matchStatsHref.split('/')[4], 10)
  }

  return {
    id,
    statsId,
    team1,
    team2,
    winnerTeam,
    date,
    format,
    additionalInfo,
    event,
    maps,
    players,
    streams,
    live,
    status,
    title,
    hasScorebot,
    highlightedPlayer,
    headToHead,
    vetoes,
    highlights,
    demos,
    odds,
    oddsCommunity
  }
}
