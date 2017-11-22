import HLTV from '../index'

HLTV.getMatch({
    id: 2317207
  }).then((matchDetails) => {
    console.log(matchDetails)
  })
