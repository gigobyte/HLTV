import { UpcomingMatch } from '../models/UpcomingMatch'
import { LiveMatch } from '../models/LiveMatch'
import { Event } from '../models/Event'
import { Team } from '../models/Team'
import { MapSlug } from '../enums/MapSlug'
import { popSlashSource, text } from '../utils/parsing'
import { HLTVConfig } from '../config'
import { fetchPage, toArray, getMatchFormatAndMap } from '../utils/mappers'
import { MatchResult } from '../models/MatchResult'

export const getEventStats = (config: HLTVConfig) => async ({ eventId }) => {
  let $ = await fetchPage(`${config.hltvUrl}/matches?event=${eventId}`, config.loadPage)

  const liveMatches: LiveMatch[] = toArray($('.live-match .a-reset')).map(matchEl => {
    const id = Number(matchEl.attr('href').split('/')[2])
    const teamEls = matchEl.find('img.logo')
    const stars = matchEl.find('.stars i').length

    const team1: Team = {
      name: teamEls.first().attr('title'),
      id: Number(popSlashSource(teamEls.first())) || undefined
    }

    const team2: Team = {
      name: teamEls.last().attr('title'),
      id: Number(popSlashSource(teamEls.last())) || undefined
    }

    const format = matchEl.find('.bestof').text()
    const maps = toArray(matchEl.find('.header .map')).map(text) as MapSlug[]

    const event: Event = {
      name: matchEl.find('.event-logo').attr('title'),
      id: Number((popSlashSource(matchEl.find('.event-logo')) as string).split('.')[0]) || undefined
    }

    return { id, team1, team2, event, format, maps, stars, live: true }
  })

  const upcomingMatches: UpcomingMatch[] = toArray($('.upcoming-match')).map(matchEl => {
    const id = Number(matchEl.attr('href').split('/')[2])
    const date = Number(matchEl.find('div.time').attr('data-unix')) || undefined
    const title = matchEl.find('.placeholder-text-cell').text() || undefined
    const stars = matchEl.find('.stars i').length

    const { map, format } = getMatchFormatAndMap(matchEl.find('.map-text').text())

    let event: Event | undefined
    let team1: Team | undefined
    let team2: Team | undefined

    if (!title) {
      team1 = {
        name: matchEl
          .find('div.team')
          .first()
          .text(),
        id: Number(popSlashSource(matchEl.find('img.logo').first())) || undefined
      }

      team2 = {
        name: matchEl
          .find('div.team')
          .last()
          .text(),
        id: matchEl.find('img.logo').get(1)
          ? Number(popSlashSource($(matchEl.find('img.logo').last())))
          : undefined
      }
      event = {
        name: matchEl.find('.event-logo').attr('alt'),
        id:
          Number((popSlashSource(matchEl.find('img.event-logo')) as string).split('.')[0]) ||
          undefined
      }
    }

    return { id, date, team1, team2, format, map, title, event, stars, live: false }
  })

  $ = await fetchPage(`${config.hltvUrl}/results?event=${eventId}`, config.loadPage)

  let results = [] as MatchResult[];

  results = results.concat(
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
          name: matchEl.find('.event-logo').attr('alt'),
          id: 3448
        }

        const date = Number(matchEl.parent().attr('data-zonedgrouping-entry-unix'))

        return { id, team1, team2, result, event, map, format, stars, date }
      }
    )
  )

  return {matches: [...liveMatches, ...upcomingMatches], results: results}
}
