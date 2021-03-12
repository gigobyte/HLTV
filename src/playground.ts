import { HLTV } from './index'

const log = (promise: Promise<any>) =>
  promise
    .then((res) => console.dir(res, { depth: null }))
    .catch((err) => console.log(err))

// log(HLTV.getMatch({ id: 2300113 }))
log(HLTV.getMatches())
