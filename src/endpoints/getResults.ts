import { MatchResult } from '../models/MatchResult'
import { Event } from '../models/Event'
import { ResultTeam } from '../models/ResultTeam'
import { MapSlug } from '../enums/MapSlug'
import { HLTVConfig } from '../config'
import { fetchPage, toArray, getMatchFormatAndMap } from '../utils/mappers'
import { ContentFilter } from '../enums/ContentFilter'

type GetResultsArguments =
  | {
      startPage?: number
      endPage?: number
      teamID?: number
      eventID?: never
      contentFilters?: ContentFilter[]
    }
  | {
      startPage?: never
      endPage?: never
      teamID?: number
      eventID?: number
      contentFilters?: ContentFilter[]
    }

export const getResults = (config: HLTVConfig) => async ({
  startPage = 0,
  endPage = 1,
  teamID,
  eventID,
  contentFilters = []
}: GetResultsArguments): Promise<MatchResult[]> => {
  if (startPage < 0) {
    console.error('getLatestResults: startPage cannot be less than 0')
    return []
  } else if (endPage < 1) {
    console.error('getLatestResults: endPage cannot be less than 1')
  }

  let matches: MatchResult[] = []
  for (let i = startPage; i < endPage; i++) {
    let url = `${config.hltvUrl}/results?offset=${i * 100}`

    if (teamID) url += `&team=${teamID}`
    if (eventID) url += `&event=${eventID}`
    for (const filter of contentFilters) {
      url += `&content=${filter}`
    }

    const $ = await fetchPage(url, config.loadPage)

    matches = matches.concat(
      toArray(
        $(
          '.results-holder > .results-all > .results-sublist .result-con .a-reset'
        )
      ).map((matchEl) => {
        const id = Number(matchEl.attr('href')!.split('/')[2])
        const stars = matchEl.find('.stars i').length

        const team1: ResultTeam = {
          name: matchEl.find('div.team').first().text(),
          logo: matchEl.find('img.team-logo').first().attr('src')!
        }

        const team2: ResultTeam = {
          name: matchEl.find('div.team').last().text(),
          logo: matchEl.find('img.team-logo').last().attr('src')!
        }

        const result = matchEl.find('.result-score').text()
        const { map, format } = getMatchFormatAndMap(
          matchEl.find('.map-text').text()
        ) as {
          map: MapSlug | undefined
          format: string
        }

        const nameOfEvent =
          typeof eventID === 'undefined'
            ? matchEl.find('.event-logo').attr('alt')!
            : $('.eventname').text()

        const event: Event = {
          name: nameOfEvent,
          id: eventID ? Number(eventID) : undefined
        }

        const eventDate =
          typeof eventID === 'undefined'
            ? matchEl.parent().attr('data-zonedgrouping-entry-unix')
            : $('.eventdate span').first().data('unix')

        const date = Number(eventDate)

        return { id, team1, team2, result, event, map, format, stars, date }
      })
    )
  }

  return matches
}
