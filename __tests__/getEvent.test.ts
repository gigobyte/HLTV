import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const FULL = 5785
const NO_INFO = 355
const WITH_QUALIFIED_FOR = 4356
const WITH_STRANGE_PRIZE = 2870

test('getEvent', async () => {
  await sleep(3000)
  expect(await HLTV.getEvent({ id: FULL })).toMatchSnapshot()
  expect(await HLTV.getEvent({ id: NO_INFO })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getEvent({ id: WITH_QUALIFIED_FOR })).toMatchSnapshot()
  expect(await HLTV.getEvent({ id: WITH_STRANGE_PRIZE })).toMatchSnapshot()
  await sleep(3000)
}, 30000)
