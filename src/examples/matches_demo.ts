import HLTV from '../index'

HLTV.getMatches()
  .then((matches) => {
    console.log(matches)
  });
