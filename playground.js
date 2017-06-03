const HLTV = require('./lib')

HLTV.getMatch({id: 2311263}).then(res => console.log(res))
HLTV.getMatches().then(res => console.log(res))
HLTV.getLatestResults({pages: 1}).then(res => console.log(res))
