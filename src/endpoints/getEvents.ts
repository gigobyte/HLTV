import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { EventResult } from '../models/EventResult'
import { EventSize } from '../enums/EventSize'
import { EventType } from '../enums/EventType'
import { SimpleEvent } from '../models/SimpleEvent'
import { popSlashSource } from '../utils/parsing'
import { checkForRateLimiting } from '../utils/checkForRateLimiting'

export const getEvents = (config: HLTVConfig) => async ({
  size,
  month
}: {
  size?: EventSize
  month?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
} = {}): Promise<EventResult[]> => {
  const $ = await fetchPage(`${config.hltvUrl}/events`, config.loadPage)

  checkForRateLimiting($)

  const events = toArray($('.events-month'))
    .map((eventEl) => {
      const checkMonth = new Date(
        eventEl.find('.standard-headline').text()
      ).getMonth()

      if (
        typeof month === 'undefined' ||
        (typeof month !== 'undefined' && month == checkMonth)
      ) {
        switch (size) {
          case EventSize.Small:
            return {
              month: checkMonth,
              events: parseEvents(
                toArray(eventEl.find('a.small-event')),
                EventSize.Small
              )
            }

          case EventSize.Big:
            return {
              month: checkMonth,
              events: parseEvents(
                toArray(eventEl.find('a.big-event')),
                EventSize.Big
              )
            }

          default:
            return {
              month: checkMonth,
              events: parseEvents(
                toArray(eventEl.find('a.big-event')),
                EventSize.Big
              ).concat(
                parseEvents(
                  toArray(eventEl.find('a.small-event')),
                  EventSize.Small
                )
              )
            }
        }
      }

      return null
    })
    .filter((x): x is EventResult => !!x)

  return events
}

const parseEvents = (
  eventsToParse: cheerio.Cheerio[],
  size?: EventSize
): SimpleEvent[] => {
  let dateSelector, nameSelector, locationSelector

  if (size == EventSize.Small) {
    dateSelector = '.eventDetails .col-desc span[data-unix]'
    nameSelector = '.col-value .text-ellipsis'
    locationSelector = '.smallCountry img'
  } else {
    dateSelector = 'span[data-unix]'
    nameSelector = '.big-event-name'
    locationSelector = '.location-top-teams img'
  }

  const events = eventsToParse.map((eventEl) => {
    const dateStart = eventEl.find(dateSelector).eq(0).data('unix')

    const dateEnd = eventEl.find(dateSelector).eq(1).data('unix')

    let teams
    let prizePool

    if (size == EventSize.Small) {
      teams = eventEl.find('.col-value').eq(1).text()
      prizePool = eventEl.find('.prizePoolEllipsis').text()
    } else {
      teams = eventEl.find('.additional-info tr').eq(0).find('td').eq(2).text()
      prizePool = eventEl
        .find('.additional-info tr')
        .eq(0)
        .find('td')
        .eq(1)
        .text()
    }

    const eventName = eventEl.find(nameSelector).text()

    const rawType =
      eventEl.find('table tr').eq(0).find('td').eq(3).text() || undefined

    const eventType = Object.entries({
      major: EventType.Major,
      online: EventType.Online,
      intl: EventType.InternationalLan,
      local: EventType.LocalLan,
      reg: EventType.RegionalLan
    }).find(([needle]) =>
      rawType ? rawType.toLowerCase().includes(needle) : false
    )?.[1]

    return {
      id: Number(eventEl.attr('href')!.split('/')[2]),
      name: eventName,
      dateStart: dateStart ? Number(dateStart) : undefined,
      dateEnd: dateEnd ? Number(dateEnd) : undefined,
      prizePool,
      teams: teams.length ? Number(teams) : undefined,
      location: {
        name: eventEl.find(locationSelector).prop('title'),
        code: popSlashSource(eventEl.find(locationSelector))!.split('.')[0]
      },
      type: eventType || EventType.Other
    }
  })

  return events
}
