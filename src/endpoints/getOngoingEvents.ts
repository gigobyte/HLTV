import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { OngoingEventResult } from '../models/OngoingEventResult'

export const getOngoingEvents = (config: HLTVConfig) => async (): Promise<OngoingEventResult[]> => {
  const $ = await fetchPage(`${config.hltvUrl}/events`, config.loadPage)

  const ongoingEventsToday = toArray($('.tab-content').first().next().find('a')).map((eventEl) => {
    return eventEl.attr('href')!.split('/')[3]
  })
  
  const ongoingEvents = toArray($('.tab-content').last().find('a')).map((eventEl) => {
    let dateSelector = '.eventDetails .col-desc span[data-unix]'
    const name = eventEl.attr('href')!.split('/')[3]
    const id = Number(eventEl.attr('href')!.split('/')[2])
    const link = config.hltvUrl + eventEl.attr('href')!
    const logo = eventEl.find('.logo').attr('src')!
    const dateStart = eventEl.find(dateSelector).eq(0).data('unix')
    const dateEnd = eventEl.find(dateSelector).eq(1).data('unix')
    const today = ongoingEventsToday.includes(name);
    
    return { name, id, link, logo, dateStart, dateEnd , today};
  })
  return ongoingEvents
}
