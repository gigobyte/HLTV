import { HLTVConfig } from '../config'
import { FullEvent } from '../models/FullEvent'
import HLTV from '../index'

export const getEventByName = (config: HLTVConfig) => async ({
  name
}: {
  name: string
}): Promise<FullEvent> => {
  const pageContent = JSON.parse(
    await config.loadPage!(`${config.hltvUrl}/search?term=${name}`)
  )
  const firstResult = pageContent[0].events[0]

  if (!firstResult) {
    throw new Error(`Event ${name} not found`)
  }

  return HLTV.getEvent({ id: firstResult.id })
}
