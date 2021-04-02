import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

test('getTeamStats', async () => {
  await sleep(3000)
  expect(await HLTV.getResults({ eventIds: [1617] })).toMatchSnapshot()
  expect(
    await HLTV.getResults({
      playerIds: [7998],
      startDate: '2020-01-01',
      endDate: '2020-03-31'
    })
  ).toMatchSnapshot()
}, 30000)
