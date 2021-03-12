import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const FULL = 2325765
const MISSING_INFO = 2290099
const OLD_PLAYERS = 2186795
const DELETED = 2315069
const VETO_IN_INFO = 2300113
const FULL_FORMAT = 2346506

test('getMatch', async () => {
  await sleep(3000)
  expect(await HLTV.getMatch({ id: FULL })).toMatchSnapshot()
  expect(await HLTV.getMatch({ id: MISSING_INFO })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatch({ id: OLD_PLAYERS })).toMatchSnapshot()
  expect(await HLTV.getMatch({ id: VETO_IN_INFO })).toMatchSnapshot()
  expect(await HLTV.getMatch({ id: DELETED })).toMatchSnapshot()
  expect(await HLTV.getMatch({ id: FULL_FORMAT })).toMatchSnapshot()
}, 30000)
