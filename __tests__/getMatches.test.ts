import HLTV from '../src/'
import { sleep } from '../src/utils'

test('getMatches', async () => {
  await sleep(3000)
  expect(await HLTV.getMatches()).not.toHaveLength(0)
  await sleep(3000)
}, 30000)
