import HLTV from '../src/index.js'
import { sleep } from '../src/utils.js'
import { expect, test } from 'vitest'

const FULL = 4608
const EMPTY = 460

test('getTeam', async () => {
  await sleep(3000)
  expect(await HLTV.getTeam({ id: FULL })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getTeam({ id: EMPTY })).toMatchSnapshot()
  await sleep(3000)
}, 500000)
