import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Country } from '../shared/Country'
import { fetchPage, getIdAt, parseNumber } from '../utils'

export interface EventPreview {
  id: number
  name: string
  dateStart: number
  dateEnd: number
  numberOfTeams?: number
  prizePool?: string
  location?: Country
}

export enum EventType {
  Major = 'MAJOR',
  InternationalLAN = 'INTLLAN',
  RegionalLAN = 'REGIONALLAN',
  LocalLAN = 'LOCALLAN',
  Online = 'ONLINE',
  Other = 'OTHER'
}

export const getEvents = (config: HLTVConfig) => async ({
  eventType,
  prizePoolMin,
  prizePoolMax
}: {
  eventType?: EventType
  prizePoolMin?: number
  prizePoolMax?: number
} = {}): Promise<EventPreview[]> => {
  const query = stringify({
    ...(eventType ? { eventType } : {}),
    ...(prizePoolMin ? { prizeMin: prizePoolMin } : {}),
    ...(prizePoolMax ? { prizeMax: prizePoolMax } : {})
  })

  const $ = HLTVScraper(
    await fetchPage(`https://www.hltv.org/events?${query}`, config.loadPage)
  )

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

      return { id, name, dateStart, dateEnd }
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

      const location = {
        name: el.find('.big-event-location').text(),
        code: el
          .find('.location-top-teams img.flag')
          .attr('src')
          .split('/')
          .pop()!
          .split('.')[0]
      }

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
        numberOfTeams
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
        name: el.find('.smallCountry .col-desc').text(),
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
        numberOfTeams
      }
    })

  return ongoingEvents.concat(bigUpcomingEvents).concat(smallUpcomingEvents)
}
