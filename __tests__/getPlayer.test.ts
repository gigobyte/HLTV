import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test('getPlayer', async () => {
  await sleep(1000)
  expect(await HLTV.getPlayer({ id: 8000 })).toMatchSnapshot()
  expect(await HLTV.getPlayer({ id: 7000 })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getPlayer({ id: 3000 })).toMatchSnapshot()
  expect(await HLTV.getPlayer({ id: 9123 })).toMatchSnapshot()
  await sleep(1000)
}, 30000)
