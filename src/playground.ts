import { HLTV } from './index'

const log = (promise: Promise<any>) =>
  promise
    .then((res) => console.dir(res, { depth: null }))
    .catch((err) => console.log(err))

// log(HLTV.getMatch({ id: 2346924 }))
// log(HLTV.getMatches())
// log(HLTV.getEvent({ id: 5741 }))
// log(HLTV.getEvents())
// log(HLTV.getMatchMapStats({ id: 115827 }))
// log(HLTV.getMatchStats({ id: 79924 }))
// log(HLTV.getPlayer({ id: 7998 }))
// log(HLTV.getPlayerRanking())
