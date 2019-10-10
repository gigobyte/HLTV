import { HLTVConfig } from '../config'
import { FullPlayer } from '../models/FullPlayer'
import HLTV from '../index'

export const getPlayerByName = (config: HLTVConfig) => async ({
  name
}: {
  name: string
}): Promise<FullPlayer> => {
  const pageContent = JSON.parse(await config.loadPage!(`${config.hltvUrl}/search?term=${name}`))
  const firstResult = pageContent[0].players[0]

  return HLTV.getPlayer({ id: firstResult.id })
}
