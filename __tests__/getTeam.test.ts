import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const FULL = 4608
const EMPTY = 460

test('getTeam', async () => {
  await sleep(3000)
  expect(await HLTV.getPlayer({ id: FULL })).toMatchSnapshot()
  expect(await HLTV.getPlayer({ id: EMPTY })).toMatchSnapshot()
}, 30000)
