import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { OngoingEventResult } from '../models/OngoingEventResult'

export const getOngoingEvents = (config: HLTVConfig) => async (): Promise<OngoingEventResult[]> => {
  const $ = await fetchPage(`${config.hltvUrl}/events`, config.loadPage)

  let ongoingEvents: Array<OngoingEventResult> = [];
  toArray($('.tab-content'))
    .map((eventEl) => {
      toArray(eventEl.find('a')).map((a) => {
        const event = {
          name: a.attr('href')!.split('/')[3],
          id: Number(a.attr('href')!.split('/')[2]),
          link: config.hltvUrl + a.attr('href')!
        }
        if (!ongoingEvents.includes(event))
          ongoingEvents.push(event);
      })
    })
  return ongoingEvents
}
