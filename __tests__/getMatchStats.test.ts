import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test('getMatchStats', async () => {
  await sleep(1000)
  expect(await HLTV.getMatchStats({ id: 62979 })).toMatchSnapshot()
  expect(await HLTV.getMatchStats({ id: 63146 })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getMatchStats({ id: 63095 })).toMatchSnapshot()
  await sleep(1000)
}, 30000)
