import HLTV from '../src/index.js'
import { sleep } from '../src/utils.js'
import { GameMap } from '../src/shared/GameMap.js'
import { BestOfFilter } from '../src/shared/BestOfFilter.js'
import { expect, test } from 'vitest'

test('getMatchStats', async () => {
  await sleep(3000)
  expect(
    await HLTV.getPlayerRanking({
      startDate: '2019-10-15',
      endDate: '2020-01-15',
      minMapCount: 5,
      maps: [GameMap.Dust2],
      bestOfX: BestOfFilter.BO1
    })
  ).toMatchSnapshot()
  await sleep(3000)
  expect(
    await HLTV.getPlayerRanking({
      minMapCount: 93,
      maps: [GameMap.Cobblestone]
    })
  ).toMatchSnapshot()
  await sleep(3000)
}, 500000)
