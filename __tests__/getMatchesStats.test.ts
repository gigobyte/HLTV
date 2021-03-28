import HLTV from '../src'

test('getMatchesStats', async () => {
  expect(
    await HLTV.getMatchesStats({
      startDate: '2021-02-23',
      endDate: '2021-02-28',
      delayBetweenPageRequests: 1500
    })
  ).toMatchSnapshot()
}, 30000)
