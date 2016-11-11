const HLTV = require('../lib/index.js')

HLTV.getMatches().then(res => {
    for(const r of res) {
        console.log(r)
        console.log('\n')
    }
})
