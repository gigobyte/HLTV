import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

test('getPlayerStats', async () => {
  expect(await HLTV.getPlayerStats({ id: 8000 })).toMatchSnapshot()
  expect(await HLTV.getPlayerStats({ id: 7000 })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getPlayerStats({ id: 3000 })).toMatchSnapshot()
  expect(await HLTV.getPlayerStats({ id: 9123 })).toMatchSnapshot()
}, 30000)
