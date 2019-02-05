import HLTV from '../src/'

test('getEvent', async () => {
  expect(await HLTV.getEvent({ id: 3452 })).toMatchSnapshot()
  expect(await HLTV.getEvent({ id: 3552 })).toMatchSnapshot()
  expect(await HLTV.getEvent({ id: 355 })).toMatchSnapshot()
  expect(await HLTV.getEvent({ id: 3005 })).toMatchSnapshot()
})
