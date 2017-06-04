const HLTV = require('./lib')

HLTV.getMatch({id: 2311263}).then(res => console.log(res))
HLTV.getMatches().then(res => console.log(res))
HLTV.getLatestResults({pages: 1}).then(res => console.log(res))
HLTV.getStreams({ loadLinks: true }).then(res => console.log(res))
HLTV.getActiveThreads().then(res => console.log(res))
HLTV.getTeamRanking().then(res => console.log(res))
HLTV.getTeamRankingDates().then(res => console.log(res))
