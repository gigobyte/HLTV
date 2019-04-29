import { MatchResult } from '../models/MatchResult'
import { Event } from '../models/Event'
import { Team } from '../models/Team'
import { MapSlug } from '../enums/MapSlug'
import { popSlashSource } from '../utils/parsing'
import { HLTVConfig } from '../config'
import { fetchPage, toArray, getMatchFormatAndMap } from '../utils/mappers'

export const getResults = (config: HLTVConfig) => async ({ pages = 1, eventId = 0 } = {}): Promise<
  MatchResult[]
> => {
  if (pages < 1) {
    console.error('getLatestResults: pages cannot be less than 1')
    return []
  }

  // All results for events are always on one page
  if(eventId) {
    pages = 1
  }

  let matches = [] as MatchResult[]

  for (let i = 0; i < pages; i++) {
    let fullUrl = `${config.hltvUrl}/results?offset=${i * 100}`
    let eventName: string

    if(eventId) {
      fullUrl += `&event=${eventId}`
    }
    
    const $ = await fetchPage(fullUrl, config.loadPage)

    if(eventId) {
      eventName = $('.eventname').text()
    }
    
    matches = matches.concat(
      toArray($('.results-holder > .results-all > .results-sublist .result-con .a-reset')).map(
        matchEl => {
          const id = Number(matchEl.attr('href').split('/')[2])
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

          const event: Event = {
            name: eventId ? eventName : matchEl.find('.event-logo').attr('alt'),
            id: eventId
              ? eventId
              : Number(popSlashSource(matchEl.find('.event-logo'))!.split('.')[0])
          }

          const date = Number(
            eventId
              ? matchEl
                  .find('.date-cell')
                  .children()
                  .first()
                  .attr('data-unix')
              : matchEl.parent().attr('data-zonedgrouping-entry-unix')
          )

          return { id, team1, team2, result, event, map, format, stars, date }
        }
      )
    )
  }

  return matches
}
