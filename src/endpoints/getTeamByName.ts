import { type HLTVConfig } from '../config.js'
import { type FullTeam, getTeam } from './getTeam.js'

export const getTeamByName =
  (config: HLTVConfig) =>
  async ({ name }: { name: string }): Promise<FullTeam> => {
    const pageContent = JSON.parse(
      await config.loadPage!(`https://www.hltv.org/search?term=${name}`)
    )
    const firstResult = pageContent[0].teams[0]

    if (!firstResult) {
      throw new Error(`Team ${name} not found`)
    }

    return getTeam(config)({ id: firstResult.id })
  }
