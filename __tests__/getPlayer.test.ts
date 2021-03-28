import HLTV from '../src/'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const FULL = 7998
const EMPTY_NEW_DESIGN = 7000
const EMPTY_OLD_DESIGN = 194

test('getPlayer', async () => {
  await sleep(3000)
  expect(await HLTV.getPlayer({ id: FULL })).toMatchSnapshot()
  expect(await HLTV.getPlayer({ id: EMPTY_NEW_DESIGN })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getPlayer({ id: EMPTY_OLD_DESIGN })).toMatchSnapshot()
  await sleep(3000)
}, 30000)
