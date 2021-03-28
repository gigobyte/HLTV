import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const FULL = 7998
const RATING_1 = 194
const RATING_2 = 11940

test('getPlayerStats', async () => {
  await sleep(3000)
  expect(await HLTV.getPlayerStats({ id: FULL })).toMatchSnapshot()
  expect(await HLTV.getPlayerStats({ id: RATING_1 })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getPlayerStats({ id: RATING_2 })).toMatchSnapshot()
}, 30000)
