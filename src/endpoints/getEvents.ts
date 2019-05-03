import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { EventResult } from 'models/EventResult'
import { SimpleEvent } from 'models/SimpleEvent'
import { EventSize } from 'enums/EventSize'
import { EventType } from 'enums/EventType'

export const getEvents = (config: HLTVConfig) => async ({ size = '' } = {}): Promise<
  EventResult[]
> => {
  const $ = await fetchPage(`${config.hltvUrl}/events`, config.loadPage)

  let events = [] as EventResult[]

  toArray($('.events-month')).map(event => {
    let monthEvents = [] as SimpleEvent[]
    let monthName = event.find('.standard-headline').text()

    switch (size) {
      case EventSize.Small:
        monthEvents = parseEvents(toArray(event.find('a.small-event')), EventSize.Small)
        break

      case EventSize.Big:
        monthEvents = parseEvents(toArray(event.find('a.big-event')), EventSize.Big)
        break

      default:
        monthEvents = parseEvents(toArray(event.find('a.big-event'))).concat(
          parseEvents(toArray(event.find('a.small-event')))
        )
        break
    }

    events.push({
      month: monthName,
      events: monthEvents
    })
  })

  return events
}

const parseEvents = (eventsToParse, size?: EventSize) => {
  let events = [] as SimpleEvent[]

  let dateSelector,
    nameSelector,
    locationSelector = ''

  if (size == EventSize.Small) {
    dateSelector = '.eventDetails .col-desc span[data-unix]'
    nameSelector = '.col-value .text-ellipsis'
    locationSelector = '.smallCountry img'
  } else {
    dateSelector = 'span[data-unix]'
    nameSelector = '.big-event-name'
    locationSelector = '.location-top-teams img'
  }

  eventsToParse.forEach(eventEl => {
    let dateStart = eventEl
      .find(dateSelector)
      .eq(0)
      .data('unix')
    let dateEnd = eventEl
      .find(dateSelector)
      .eq(1)
      .data('unix')
    let teams = '0'
    let prizePool = ''

    if (size == EventSize.Small) {
      teams = eventEl
        .find('.col-value')
        .eq(1)
        .text()
      prizePool = eventEl.find('.prizePoolEllipsis').text()
    } else {
      teams = eventEl
        .find('.additional-info tr')
        .eq(0)
        .find('td')
        .eq(2)
        .text()
      prizePool = eventEl
        .find('.additional-info tr')
        .eq(0)
        .find('td')
        .eq(1)
        .text()
    }

    let eventName = eventEl.find(nameSelector).text()

    let typeName = eventEl
      .find('table tr')
      .eq(0)
      .find('td')
      .eq(3)
      .text()

    if (!typeName)
      typeName = eventName.toLowerCase().indexOf('major') > -1 ? EventType.Major : undefined

    events.push({
      id: Number(eventEl.attr('href').split('/')[2]),
      name: eventName,
      dateStart: dateStart ? Number(dateStart) : undefined,
      dateEnd: dateEnd ? Number(dateEnd) : undefined,
      prizePool: prizePool,
      teams: teams.length ? Number(teams) : undefined,
      location: eventEl.find(locationSelector).prop('title'),
      type: typeName ? (typeName as EventType) : undefined
    })
  })

  return events
}
