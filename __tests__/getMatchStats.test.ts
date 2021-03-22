import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const FULL_INFO_NEWEST = 79928
const FULL_INFO = 62979
const RATING_1 = 22124

test('getMatchStats', async () => {
  await sleep(3000)
  expect(await HLTV.getMatchStats({ id: FULL_INFO })).toMatchSnapshot()
  expect(await HLTV.getMatchStats({ id: RATING_1 })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatchStats({ id: FULL_INFO_NEWEST })).toMatchSnapshot()
  await sleep(3000)
}, 30000)
