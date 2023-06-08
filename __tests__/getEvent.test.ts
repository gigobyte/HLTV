import HLTV from '../src/'
import { sleep } from '../src/utils'

const FULL = 5785
const NO_INFO = 355
const WITH_QUALIFIED_FOR = 4356
const WITH_STRANGE_PRIZE = 2870
const EVENT_FROM_2023 = 6861

test('getEvent', async () => {
  await sleep(3000)
  expect(await HLTV.getEvent({ id: FULL })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getEvent({ id: NO_INFO })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getEvent({ id: WITH_QUALIFIED_FOR })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getEvent({ id: WITH_STRANGE_PRIZE })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getEvent({ id: EVENT_FROM_2023 })).toMatchSnapshot()
  await sleep(3000)
}, 30000)
