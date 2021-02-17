import { HLTVConfig } from '../config'
import { FullTeam } from '../models/FullPlayer'
import HLTV from '../index'

export const getTeamByName = (config: HLTVConfig) => async ({
  name
}: {
  name: string
}): Promise<FullTeam> => {
  const pageContent = JSON.parse(
    await config.loadPage!(`${config.hltvUrl}/search?term=${name}`)
  )
  const firstResult = pageContent[0].players[0]

  if (!firstResult) {
    throw new Error(`Team ${name} not found`)
  }

  return HLTV.getTeam({ id: firstResult.id })
}
