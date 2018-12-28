import HLTV from '../src/'

test('getMatchStats', async () => {
    expect(await HLTV.getMatchStats({id: 62979})).toMatchSnapshot()
    expect(await HLTV.getMatchStats({id: 63146})).toMatchSnapshot()
    expect(await HLTV.getMatchStats({id: 63095})).toMatchSnapshot()
})