import HLTV from '../src/index.js'
import { sleep } from '../src/utils.js'
import { expect, test } from 'vitest'

test('getMatches', async () => {
  await sleep(3000)
  expect(await HLTV.getMatches()).not.toHaveLength(0)
  await sleep(3000)
}, 500000)
