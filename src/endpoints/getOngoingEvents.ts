import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { OngoingEventResult } from '../models/OngoingEventResult'

export const getOngoingEvents = (config: HLTVConfig) => async (): Promise<
  OngoingEventResult[]
> => {
  const $ = await fetchPage(`${config.hltvUrl}/events`, config.loadPage)

  const ongoingEventsToday = toArray(
    $('.tab-content').first().next().find('a')
  ).map((eventEl) => {
    return eventEl.find('.event-name-small .text-ellipsis').text()
  })

  const featuredEvents = toArray($('.tab-content#FEATURED a')).map(
    (eventEl) => {
      return eventEl.find('.event-name-small .text-ellipsis').text()
    }
  )

  const ongoingEvents = toArray($('.tab-content').last().find('a')).map(
    (eventEl) => {
      const dateSelector = '.eventDetails .col-desc span[data-unix]'
      const name = eventEl.find('.event-name-small .text-ellipsis').text()
      const id = Number(eventEl.attr('href')!.split('/')[2])
      const dateStart = eventEl.find(dateSelector).eq(0).data('unix')
      const dateEnd = eventEl.find(dateSelector).eq(1).data('unix')
      const today = ongoingEventsToday.includes(name)
      const featured = featuredEvents.includes(name)

      return {
        name,
        id,
        dateStart,
        dateEnd: dateEnd || dateStart,
        today,
        featured
      }
    }
  )
  return ongoingEvents
}
