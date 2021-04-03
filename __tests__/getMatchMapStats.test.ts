import HLTV from '../src/'
import { sleep } from '../src/utils'

const FULL_INFO_NEWEST = 116688
const FULL_INFO = 79440
const RATING_1 = 14783

test('getMatchMapStats', async () => {
  await sleep(3000)
  expect(
    await HLTV.getMatchMapStats({ id: FULL_INFO_NEWEST })
  ).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatchMapStats({ id: FULL_INFO })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatchMapStats({ id: RATING_1 })).toMatchSnapshot()
  await sleep(3000)
}, 30000)
