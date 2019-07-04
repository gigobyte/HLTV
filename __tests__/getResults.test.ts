import HLTV from '../src/'

test('getMatch', async () => {
  expect(await HLTV.getResults({ eventID: 1611 })).toMatchSnapshot()
}, 30000)
