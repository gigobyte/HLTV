import HLTV from './index'
// HLTV.getMatch({ id: 2332676 })
//   .then(res => console.dir(res, { depth: null }))
//   .catch(err => console.log(err))
// HLTV.getMatches().then(res => console.log(res))
// HLTV.getResults({pages: 1}).then(res => console.log(res))
// HLTV.getStreams({ loadLinks: true }).then(res => console.log(res))
// HLTV.getActiveThreads().then(res => console.log(res))
// HLTV.getTeamRanking().then(res => console.log(res))
// HLTV.getTeamRanking({ country: 'Thailand' }).then(res => console.log(res))
// HLTV.connectToScorebot({id: 2330349, onScoreboardUpdate: (data) => {
//     console.log('scoreboard update!')
//     console.dir(data, { depth: null })
// }, onLogUpdate: (data) => {
//     console.log('log update!')
//     console.dir(data, { depth: null })
// }, onFullLogUpdate: (data) => {
//     console.log('fullLog update!')
//     console.dir(data, { depth: null })
// }})
// HLTV.getMatchesStats({startDate: '2017-07-10', endDate: '2017-07-18'}).then(res => console.log(res.length))
// HLTV.getMatch({id: 2312432}).then(res => console.dir(res, {depth: null})).catch(err => console.log(err))
// HLTV.getMatchMapStats({id: 49968}).then(res => console.dir(res, { depth: null }))
// HLTV.getMatchStats({id: 62979}).then(res => console.dir(res, { depth: null }))
// HLTV.getTeam({ id: 9481 })
//   .then(res => console.dir(res, { depth: null }))
//   .catch(err => console.log(err))
// HLTV.getTeamStats({id: 6669}).then(res => console.dir(res, { depth: null })).catch(err => console.log(err))
// HLTV.getPlayer({id: 9216}).then(res => console.dir(res, { depth: null })).catch(err => console.log(err))
// HLTV.getEvent({id: 3773}).then(res => console.dir(res, { depth: null })).catch(err => console.log(err))


HLTV.getResults({pages: 1, eventId: 3883}).then(res => console.log(res))
HLTV.getResults({pages: 1, eventId: 3047}).then(res => console.log(3047 + ':' + res.length))