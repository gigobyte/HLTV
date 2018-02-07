import HLTV from './index'
// HLTV.getLatestResults({pages: 1}).then(res => console.log(res))
// HLTV.getStreams({ loadLinks: true }).then(res => console.log(res))
// HLTV.getActiveThreads().then(res => console.log(res))
// HLTV.getTeamRanking().then(res => console.log(res))
// HLTV.getTeamRankingDates().then(res => console.log(res))
// HLTV.connectToScorebot({id: 2318676,
//     onConnect: () => {
//         console.log('connected')
//     },
//     onScoreboardUpdate: (data) => {
//         console.log(data)
//     }, onLogUpdate: () => {
//     }})
// HLTV.getMatchesStats({startDate: '2017-07-10', endDate: '2017-07-18'}).then(res => console.log(res.length))
// HLTV.getTeam({id: 7144}).then(res => console.dir(res, { depth: null })).catch(err => console.log(err))
// HLTV.getTeamStats({id: 6669}).then(res => console.dir(res, { depth: null })).catch(err => console.log(err))
// HLTV.getPlayer({id: 1339}).then(res => console.dir(res, { depth: null })).catch(err => console.log(err))
// HLTV.getMatchMapStats({id: 60032}).then(() => {
//     // console.log(res)
//     console.log('hah')
// }).catch(() => {
//     // console.log(err)
// })

// HLTV.getMatch({id: 2318732}).then((res) => {
//     console.log(res)
// })
HLTV.getResults()
    .then((results) => {
        console.log(results)
    });
