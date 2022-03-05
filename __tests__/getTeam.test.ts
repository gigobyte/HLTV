import HLTV from '../src/'
import { sleep } from '../src/utils'

const FULL = 4608
const EMPTY = 460

test('getTeam', async () => {
  await sleep(3000)
  expect(await HLTV.getTeam({ id: FULL })).toMatchSnapshot()
  await sleep(3000)
  expect(await HLTV.getTeam({ id: EMPTY })).toMatchSnapshot()
  await sleep(3000)
}, 30000)
