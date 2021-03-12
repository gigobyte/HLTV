import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const FULL = 2325765
const MISSING_INFO = 2290099
const OLD_PLAYERS = 2186795
const DELETED = 2315069
const VETO_IN_INFO = 2300113

test('getMatch', async () => {
  await sleep(3000)
  expect(await HLTV.getMatch({ id: FULL })).toMatchSnapshot('FULL')
  expect(await HLTV.getMatch({ id: MISSING_INFO })).toMatchSnapshot(
    'MISSING_INFO'
  )
  await sleep(3000)
  expect(await HLTV.getMatch({ id: OLD_PLAYERS })).toMatchSnapshot(
    'OLD_PLAYERS'
  )
  expect(await HLTV.getMatch({ id: VETO_IN_INFO })).toMatchSnapshot(
    'VETO_IN_INFO'
  )
  expect(await HLTV.getMatch({ id: DELETED })).toMatchSnapshot('DELETED')
}, 30000)
