import HLTV from '../src'
import { sleep } from '../src/utils'

test('getMatchesStats', async () => {
  await sleep(3000)
  expect(
    await HLTV.getMatchesStats({
      startDate: '2021-02-23',
      endDate: '2021-02-28',
      delayBetweenPageRequests: 1500
    })
  ).toMatchSnapshot()
  await sleep(3000)
}, 30000)
