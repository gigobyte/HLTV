import { HLTVConfig } from '../config'
import { FullPlayer } from '../../lib/models/FullPlayer'
import HLTV from '../index'

export const getPlayerByName = (config: HLTVConfig) => async ({
  name
}: {
  name: string
}): Promise<FullPlayer> => {
  if (config.loadPage === undefined) throw new Error('\'config.loadPage\' function is not Defined')
  const pageContent = JSON.parse(await config.loadPage(`${config.hltvUrl}/search?term=${name}`))
  let playerArr = pageContent[0].players[0]

  let retArr = await HLTV.getPlayer({id: playerArr.id})

  console.log(retArr)
  return retArr
}