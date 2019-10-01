import { HLTVConfig } from '../config'
import axios from 'axios'
import { ISOCodesToLong } from '../utils/parsing'
import { SearchPlayer } from 'models/SearchPlayer'

export const getPlayerByName = (config: HLTVConfig) => async ({
  name
}: {
  name: string
}): Promise<SearchPlayer> => {
  return axios.get(`${config.hltvUrl}/search?term=${name}`)
    .then((response) => {
      let playerArr = response.data[0].players

      return playerArr.map(element => {
        const { flagUrl } = element
        return {
          id: element.id,
          name: `${element.firstName} ${element.lastName}`,
          ign: element.nickName,
          image: element.pictureUrl,
          country: {
            name: ISOCodesToLong(flagUrl.substring(flagUrl.length - 6, flagUrl.length - 4)),
            code: flagUrl.substring(flagUrl.length - 6, flagUrl.length - 4)
          },
          team: {
            name: element.team.name,
            id: element.team.location.split('/')[2]
          }
        }
      })
    })
}