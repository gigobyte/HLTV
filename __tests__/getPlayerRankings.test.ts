import HLTV, { Map } from '../src/'
import { BestOfFilter } from '../src/enums/BestOfFilter'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

test('getMatchStats', async () => {
  await sleep(3000)
  expect(
    await HLTV.getPlayerRanking({
      startDate: '2019-10-15',
      endDate: '2020-01-15',
      minMapCount: 5,
      maps: [Map.Dust2],
      bestOfX: BestOfFilter.BO1
    })
  ).toMatchSnapshot()
  await sleep(3000)
  expect(
    await HLTV.getPlayerRanking({
      startDate: '2019-10-15',
      endDate: '2020-01-15',
      minMapCount: 5,
      country: ['Latvia', 'Estonia', 'Lithuania']
    })
  ).toMatchSnapshot()
}, 30000)
