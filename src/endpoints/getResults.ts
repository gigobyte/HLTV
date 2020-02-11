import { MatchResult } from '../models/MatchResult'
import { Event } from '../models/Event'
import { Team } from '../models/Team'
import { MapSlug } from '../enums/MapSlug'
import { popSlashSource } from '../utils/parsing'
import { HLTVConfig } from '../config'
import { fetchPage, toArray, getMatchFormatAndMap } from '../utils/mappers'
import { ContentFilter } from '../enums/ContentFilter'

type GetResultsArguments =
  | { pages?: number; teamID?: number; eventID?: never; contentFilter?: ContentFilter[] }
  | { pages?: never; teamID?: number; eventID?: number; contentFilter?: ContentFilter[] }

export const getResults = (config: HLTVConfig) => async ({
  pages = 1,
  teamID,
  eventID,
  contentFilter
}: GetResultsArguments): Promise<MatchResult[]> => {
  if (pages < 1) {
    console.error('getLatestResults: pages cannot be less than 1')
    return []
  }

  let matches = [] as MatchResult[]

  for (let i = 0; i < pages; i++) {
    let url = `${config.hltvUrl}/results?offset=${i * 100}`

    if (teamID) url += `&team=${teamID}`
	if (eventID) url += `&event=${eventID}`
	if (contentFilter?.length) {
		for (let filter of contentFilter) {
			url += `&content=${filter}`
		}
	}

    const $ = await fetchPage(url, config.loadPage)

    matches = matches.concat(
      toArray($('.results-holder > .results-all > .results-sublist .result-con .a-reset')).map(
        matchEl => {
          const id = Number(matchEl.attr('href')!.split('/')[2])
          const stars = matchEl.find('.stars i').length

          const team1: Team = {
            id: Number(popSlashSource(matchEl.find('img.team-logo').first())),
            name: matchEl
              .find('div.team')
              .first()
              .text()
          }

          const team2: Team = {
            id: Number(popSlashSource(matchEl.find('img.team-logo').last())),
            name: matchEl
              .find('div.team')
              .last()
              .text()
          }

          const result = matchEl.find('.result-score').text()
          const { map, format } = getMatchFormatAndMap(matchEl.find('.map-text').text()) as {
            map: MapSlug | undefined
            format: string
          }

          let idOfEvent =
            typeof eventID === 'undefined'
              ? popSlashSource(matchEl.find('.event-logo'))!.split('.')[0]
              : eventID
          let nameOfEvent =
            typeof eventID === 'undefined'
              ? matchEl.find('.event-logo').attr('alt')!
              : $('.eventname').text()

          const event: Event = {
            name: nameOfEvent,
            id: Number(idOfEvent)
          }

          let eventDate =
            typeof eventID === 'undefined'
              ? matchEl.parent().attr('data-zonedgrouping-entry-unix')
              : $('.eventdate span')
                  .first()
                  .data('unix')

          const date = Number(eventDate)

          return { id, team1, team2, result, event, map, format, stars, date }
        }
      )
    )
  }

  return matches
}
