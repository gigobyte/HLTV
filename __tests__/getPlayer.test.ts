import HLTV from '../src/'
import { sleep } from '../src/utils'

const FULL = 7998
const EMPTY_NEW_DESIGN = 7000
const EMPTY_OLD_DESIGN = 194

test('getPlayer', async () => {
  await sleep(3000)
  expect(await HLTV.getPlayer({ id: FULL })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getPlayer({ id: EMPTY_NEW_DESIGN })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getPlayer({ id: EMPTY_OLD_DESIGN })).toMatchSnapshot()
  await sleep(3000)
}, 30000)
