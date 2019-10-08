import { HLTVConfig } from '../config'
import { FullPlayer } from '../../lib/models/FullPlayer'
import HLTV from '../index'

export const getPlayerByName = (config: HLTVConfig) => async ({
  name
}: {
  name: string
}): Promise<FullPlayer> => {
  const pageContent = JSON.parse(await config.loadPage(`${config.hltvUrl}/search?term=${name}`))
  let playerArr = pageContent[0].players[0]

  let retArr = await HLTV.getPlayer({ id: playerArr.id })

  return retArr
}