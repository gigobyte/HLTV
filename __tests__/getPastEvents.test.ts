import HLTV from '../src'
import { EventType } from '../src/shared/EventType'

test('getPastEvents', async () => {
  expect(
    await HLTV.getPastEvents({
      startDate: '2017-01-01',
      endDate: '2017-12-31',
      eventType: EventType.InternationalLAN,
      delayBetweenPageRequests: 1500
    })
  ).toMatchSnapshot()
}, 30000)
