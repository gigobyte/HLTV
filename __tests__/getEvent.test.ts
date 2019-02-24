import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test('getEvent', async () => {
  expect(await HLTV.getEvent({ id: 3452 })).toMatchSnapshot()
  expect(await HLTV.getEvent({ id: 3552 })).toMatchSnapshot()
  expect(await HLTV.getEvent({ id: 355 })).toMatchSnapshot()
  await sleep(3000) // Sleep to prevent accidental ban by hltv
  expect(await HLTV.getEvent({ id: 3005 })).toMatchSnapshot()
  expect(await HLTV.getEvent({ id: 4356 })).toMatchSnapshot()
  expect(await HLTV.getEvent({ id: 2870 })).toMatchSnapshot()
}, 30000)
