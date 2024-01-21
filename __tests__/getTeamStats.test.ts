import HLTV from '../src/index.js'
import { sleep } from '../src/utils.js'
import { expect, test } from 'vitest'

const FULL = 9863
const EMPTY = 9918

test('getTeamStats', async () => {
  await sleep(3000)
  expect(await HLTV.getTeamStats({ id: FULL })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getTeamStats({ id: EMPTY })).toMatchSnapshot()
  await sleep(3000)
}, 500000)
