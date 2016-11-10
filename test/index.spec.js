const HLTV = require('../lib/index.js')

HLTV.getMatches().then(res => console.log(res.slice(0,10)))
