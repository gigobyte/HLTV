import HLTV from '../src'
import { EventType } from '../src/shared/EventType'
import { sleep } from '../src/utils'

test('getPastEvents', async () => {
  await sleep(3000)
  expect(
    await HLTV.getPastEvents({
      startDate: '2017-01-01',
      endDate: '2017-12-31',
      eventType: EventType.InternationalLAN,
      delayBetweenPageRequests: 3000
    })
  ).toMatchSnapshot()
  await sleep(3000)
}, 30000)
