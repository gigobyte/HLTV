import HLTV from '../src/'
import { sleep } from '../src/utils'

const FULL = 2325765
const MISSING_INFO = 2290099
const OLD_PLAYERS = 2186795
const DELETED = 2315069
const VETO_IN_INFO = 2300113
const FULL_FORMAT = 2346506
const MATCH_FROM_2023 = 2364892

test('getMatch', async () => {
  await sleep(3000)
  expect(await HLTV.getMatch({ id: FULL })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatch({ id: MISSING_INFO })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatch({ id: OLD_PLAYERS })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatch({ id: VETO_IN_INFO })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatch({ id: DELETED })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatch({ id: FULL_FORMAT })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatch({ id: MATCH_FROM_2023 })).toMatchSnapshot()
  await sleep(3000)
}, 50000)
