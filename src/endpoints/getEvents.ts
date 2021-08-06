import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Country } from '../shared/Country'
import { EventType } from '../shared/EventType'
import { fetchPage, getIdAt, parseNumber } from '../utils'

export interface EventPreview {
  id: number
  name: string
  dateStart: number
  dateEnd: number
  numberOfTeams?: number
  prizePool?: string
  location?: Country
  featured: boolean
}

export interface GetEventsArguments {
  eventType?: EventType
  prizePoolMin?: number
  prizePoolMax?: number
  attendingTeamIds?: number[]
  attendingPlayerIds?: number[]
}

export const getEvents =
  (config: HLTVConfig) =>
  async (options: GetEventsArguments = {}): Promise<EventPreview[]> => {
    const query = stringify({
      ...(options.eventType ? { eventType: options.eventType } : {}),
      ...(options.prizePoolMin ? { prizeMin: options.prizePoolMin } : {}),
      ...(options.prizePoolMax ? { prizeMax: options.prizePoolMax } : {}),
      ...(options.attendingTeamIds ? { team: options.attendingTeamIds } : {}),
      ...(options.attendingPlayerIds
        ? { player: options.attendingPlayerIds }
        : {})
    })

    const $ = HLTVScraper(
      await fetchPage(`https://www.hltv.org/events?${query}`, config.loadPage)
    )

    const featuredOngoingEvents = $(
      '.tab-content[id="FEATURED"] a.ongoing-event'
    )
      .toArray()
      .map((el) => el.attrThen('href', getIdAt(2)))

    const ongoingEvents = $('.tab-content[id="ALL"] a.ongoing-event')
      .toArray()
      .map((el) => {
        const id = el.attrThen('href', getIdAt(2))!
        const name = el.find('.event-name-small .text-ellipsis').text()

        const dateStart = el
          .find('tr.eventDetails span[data-unix]')
          .first()
          .numFromAttr('data-unix')!

        const dateEnd = el
          .find('tr.eventDetails span[data-unix]')
          .last()
          .numFromAttr('data-unix')!

        const featured = featuredOngoingEvents.includes(id)

        return { id, name, dateStart, dateEnd, featured }
      })

    const bigUpcomingEvents = $('a.big-event')
      .toArray()
      .map((el) => {
        const id = el.attrThen('href', getIdAt(2))!
        const name = el.find('.big-event-name').text()

        const dateStart = el
          .find('.additional-info .col-date span[data-unix]')
          .first()
          .numFromAttr('data-unix')!

        const dateEnd = el
          .find('.additional-info .col-date span[data-unix]')
          .last()
          .numFromAttr('data-unix')!

        const locationName = el.find('.big-event-location').text()

        const location =
          locationName !== 'TBA'
            ? {
                name: locationName,
                code: el
                  .find('.location-top-teams img.flag')
                  .attr('src')
                  .split('/')
                  .pop()!
                  .split('.')[0]
              }
            : undefined

        const prizePool = el
          .find('.additional-info tr')
          .first()
          .find('td')
          .eq(1)
          .text()

        const numberOfTeams = parseNumber(
          el.find('.additional-info tr').first().find('td').eq(2).text()
        )

        return {
          id,
          name,
          dateStart,
          dateEnd,
          location,
          prizePool,
          numberOfTeams,
          featured: true
        }
      })

    const smallUpcomingEvents = $('a.small-event')
      .toArray()
      .map((el) => {
        const id = el.attrThen('href', getIdAt(2))!
        const name = el
          .find('.table tr')
          .first()
          .find('td')
          .first()
          .find('.text-ellipsis')
          .text()

        const dateStart = el
          .find('td span[data-unix]')
          .first()
          .numFromAttr('data-unix')!

        const dateEnd = el
          .find('td span[data-unix]')
          .last()
          .numFromAttr('data-unix')!

        const location = {
          name: el.find('.smallCountry .col-desc').text().replace(' | ', ''),
          code: el
            .find('.smallCountry img.flag')
            .attr('src')
            .split('/')
            .pop()!
            .split('.')[0]
        }

        const prizePool = el.find('.prizePoolEllipsis').text()
        const numberOfTeams = parseNumber(
          el.find('.prizePoolEllipsis').prev().text()
        )

        return {
          id,
          name,
          dateStart,
          dateEnd,
          location,
          prizePool,
          numberOfTeams,
          featured: false
        }
      })

    return ongoingEvents.concat(bigUpcomingEvents).concat(smallUpcomingEvents)
  }
