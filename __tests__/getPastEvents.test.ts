import HLTV from '../src/index.js'
import { EventType } from '../src/shared/EventType.js'
import { sleep } from '../src/utils.js'
import { expect, test } from 'vitest'

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
