import HLTV, { GameMap } from '../src/'
import { sleep } from '../src/utils'

const EVENT_1 = 5605
const EVENT_2 = 6372
const MAPS = [GameMap.Overpass, GameMap.Nuke]

test('getAces', async () => {
  await sleep(3000)
  expect(await HLTV.getAces({ eventIds: [EVENT_1] })).toMatchSnapshot()
  await sleep(3000)
  expect(
    await HLTV.getAces({ eventIds: [EVENT_2], maps: MAPS })
  ).toMatchSnapshot()
  await sleep(3000)
}, 30000)
