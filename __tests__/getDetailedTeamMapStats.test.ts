import HLTV from '../src/index.js'
import { sleep } from '../src/utils.js'
import { expect, test } from 'vitest'

const FULL = 9863
const EMPTY = 9918

test('getDetailedTeamMapStats', async () => {
  await sleep(3000)
  expect(await HLTV.getDetailedTeamMapStats({ id: FULL })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getDetailedTeamMapStats({ id: EMPTY })).toMatchSnapshot()
  await sleep(3000)
}, 30000)
