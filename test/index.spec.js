const HLTV = require('../lib/index.js')

const hltv = new HLTV()

hltv.getMatches().then(res => {
    for(const r of res) {
        console.log(r)
        console.log('\n')
    }
})
