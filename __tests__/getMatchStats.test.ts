import HLTV from '../src/index.js'
import { sleep } from '../src/utils.js'
import { expect, test } from 'vitest'

const FULL_INFO_NEWEST = 79928
const FULL_INFO = 62979
const RATING_1 = 22124
const SIX_PLAYERS = 80328

test('getMatchStats', async () => {
  await sleep(3000)
  expect(await HLTV.getMatchStats({ id: FULL_INFO })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatchStats({ id: RATING_1 })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatchStats({ id: FULL_INFO_NEWEST })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatchStats({ id: SIX_PLAYERS })).toMatchSnapshot()
  await sleep(3000)
}, 500000)
