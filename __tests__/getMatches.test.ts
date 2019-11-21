import HLTV from '../src/'

test('getMatches', async () => {
  expect(await HLTV.getMatches()).not.toHaveLength(0);
}, 30000)
