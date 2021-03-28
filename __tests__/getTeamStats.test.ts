import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const FULL = 9863
const EMPTY = 9918

test('getTeamStats', async () => {
  await sleep(3000)
  expect(await HLTV.getTeamStats({ id: FULL })).toMatchSnapshot()
  expect(await HLTV.getTeamStats({ id: EMPTY })).toMatchSnapshot()
}, 30000)
