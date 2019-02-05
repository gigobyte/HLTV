import HLTV from '../src/'

test('getMatch', async () => {
  expect(await HLTV.getMatch({ id: 2325765 })).toMatchSnapshot()
  expect(await HLTV.getMatch({ id: 2302345 })).toMatchSnapshot()
  expect(await HLTV.getMatch({ id: 2290099 })).toMatchSnapshot()
  expect(await HLTV.getMatch({ id: 2186795 })).toMatchSnapshot()
})
