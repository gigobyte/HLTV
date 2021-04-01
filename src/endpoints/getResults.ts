import { GameMap } from '../shared/GameMap'
import { HLTVConfig } from '../config'
import { Team } from '../shared/Team'
import { Event } from '../shared/Event'
import { fetchPage } from '../utils'
import { HLTVScraper } from '../scraper'


type GetResultsArguments =
  | {
    startPage?: number
    endPage?: number
    teamID?: number
    eventID?: never
  }
  | {
    startPage?: never
    endPage?: never
    teamID?: number
    eventID?: number
  }

interface ResultTeam {
  readonly name: string
  readonly logo: string
}

export interface MatchResult {
  readonly id: number
  readonly team1: Team
  readonly team2: Team
  readonly format: string
  readonly event: Event
  readonly map?: GameMap
  readonly result: string
  readonly stars: number
  readonly date: number
}

const getMatchFormatAndMap = (
  mapText: string
): { map?: GameMap; format?: string } => {
  if (mapText && !mapText.includes('bo')) {
    return { map: mapText as GameMap, format: 'bo1' }
  }

  if (!mapText) {
    return {}
  }

  return { format: mapText }
}

export const getResults = (config: HLTVConfig) => async ({
  startPage = 0,
  endPage = 1,
  teamID,
  eventID,
}: GetResultsArguments): Promise<MatchResult[]> => {
  if (startPage < 0) {
    console.error('getLatestResults: startPage cannot be less than 0')
    return []
  } else if (endPage < 1) {
    console.error('getLatestResults: endPage cannot be less than 1')
  }

  let matches: MatchResult[] = []
  for (let i = startPage; i < endPage; i++) {
    let url = `https://www.hltv.org/results?offset=${i * 100}`

    if (teamID) url += `&team=${teamID}`
    if (eventID) url += `&event=${eventID}`

    const $ = HLTVScraper(
      await fetchPage(
        url,
        config.loadPage
      )
    )
    
    matches = $('.results-holder > .results-all > .results-sublist .result-con .a-reset')
      .toArray()
      .map((el) => {
        const id = Number(el.attr('href')!.split('/')[2])
        const stars = el.find('.stars i').length

        const team1: ResultTeam = {
          name: el.find('div.team').first().text(),
          logo: el.find('img.team-logo').first().attr('src')!
        }

        const team2: ResultTeam = {
          name: el.find('div.team').last().text(),
          logo: el.find('img.team-logo').last().attr('src')!
        }

        const result = el.find('.result-score').text()
        const { map, format } = getMatchFormatAndMap(
          el.find('.map-text').text()
        ) as {
          map: GameMap | undefined
          format: string
        }

        const nameOfEvent =
          typeof eventID === 'undefined'
            ? el.find('.event-logo').attr('alt')!
            : $('.eventname').text()

        const event: Event = {
          name: nameOfEvent
        }

        const eventDate =
          typeof eventID === 'undefined'
            ? el.parent().attr('data-zonedgrouping-entry-unix')
            : $('.eventdate span').first().data('unix')

        const date = Number(eventDate)

        return { id, team1, team2, result, event, map, format, stars, date }
      })
    matches.concat(matches)
  }
  return matches
}