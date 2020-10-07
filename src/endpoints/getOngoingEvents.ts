import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { OngoingEventResult } from '../models/OngoingEventResult'

export const getOngoingEvents = (config: HLTVConfig) => async (): Promise<OngoingEventResult[]> => {
  const $ = await fetchPage(`${config.hltvUrl}/events`, config.loadPage)

  let ongoingEvents: Array<OngoingEventResult> = [];
  toArray($('.tab-content'))
    .map((eventEl) => {
      toArray(eventEl.find('a')).map((a) => {
        let dateSelector = '.eventDetails .col-desc span[data-unix]'
        const event = {
          name: a.attr('href')!.split('/')[3],
          id: Number(a.attr('href')!.split('/')[2]),
          link: config.hltvUrl + a.attr('href')!,
          logo: a.find('.logo').attr('src')!,
          dateStart: a.find(dateSelector).eq(0).data('unix'),
          dateEnd: a.find(dateSelector).eq(1).data('unix')
        }
        if (!ongoingEvents.includes(event))
          ongoingEvents.push(event);
      })
    })
  return ongoingEvents
}
