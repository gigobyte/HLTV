[![Dependency Status](https://david-dm.org/gigobyte/hltv.svg)](https://david-dm.org/gigobyte/hltv)
[![devDependencies Status](https://david-dm.org/gigobyte/hltv/dev-status.svg)](https://david-dm.org/gigobyte/hltv?type=dev)

<h1 align="center">
  <img src="https://www.hltv.org/img/static/TopLogo2x.png" alt="HLTV logo" width="200">
  <br>
  The unofficial HLTV Node.js API
  <br>
</h1>

Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [getMatch](#getmatch)
  - [getMatches](#getmatches)
  - [getMatchesStats](#getmatchesstats)
  - [getMatchStats](#getmatchstats)
  - [getMatchMapStats](#getmatchmapstats)
  - [getResults](#getresults)
  - [getStreams](#getstreams)
  - [getRecentThreads](#getrecentthreads)
  - [getTeamRanking](#getteamranking)
  - [getTeam](#getteam)
  - [getTeamStats](#getteamstats)
  - [getPlayer](#getplayer)
  - [getPlayerByName](#getplayerbyname)
  - [getPlayerStats](#getplayerstats)
  - [getPlayerRanking](#getplayerranking)
  - [getEvents](#getevents)
  - [getEvent](#getevent)
  - [connectToScorebot](#connecttoscorebot)

## Installation

[![NPM](https://nodei.co/npm/hltv.png)](https://nodei.co/npm/hltv/)

## Usage

:warning: **WARNING:** Abusing this library will likely result in an IP ban from HLTV simply because of Cloudflare bot protection.

&nbsp; &nbsp; &nbsp; &nbsp;Please use with caution and try to limit the rate and amount of your requests if you value your access to HLTV.

```javascript
import HLTV from 'hltv'
// Or if you're stuck with CommonJS
const { HLTV } = require('hltv')
```

#### Configuration

You can create an instance of HLTV with a custom config if you want to.

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
hltvUrl | string | https://www.hltv.org | Url that will be used to construct requests to HLTV
hltvStaticUrl | string | https://static.hltv.org | Url that will be used to construct links to images
loadPage | function | based on the 'request' library | Function that will be called when the library makes a request to HLTV
httpAgent | HttpAgent | HttpsAgent | Http agent used when sending a request and connecting to the scoreboard websocket

```javascript
const myHLTV = HLTV.createInstance({loadPage: (url) => axios.get(url)})
//or
const myHLTV = HLTV.createInstance({loadPage: (url) => fetch(url)})
```

**[See config schema](https://github.com/gigobyte/HLTV/blob/master/src/config.ts)**

## API

#### getMatch

Parses most information from a match page

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
id | number | - | The match id 

```javascript
HLTV.getMatch({id: 2306295}).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullMatch.ts)**

***

#### getMatches

Parses all matches from the `hltv.org/matches/` page

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
| - | - | - | - |
```javascript
HLTV.getMatches().then((res) => {
  ...
})
```

**[See schema for Live Matches](https://github.com/gigobyte/HLTV/blob/master/src/models/LiveMatch.ts)**

**[See schema for Upcoming Matches](https://github.com/gigobyte/HLTV/blob/master/src/models/UpcomingMatch.ts)**

***

#### getMatchesStats

Parses all matches from the `hltv.org/stats/matches` page

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
| startDate | string? | - | - |
| endDate | string? | - | - |
| matchType | [MatchType](https://github.com/gigobyte/HLTV/blob/master/src/enums/MatchType.ts)? | - | - |
| maps | [Map](https://github.com/gigobyte/HLTV/blob/master/src/enums/Map.ts)[]? | - | - |
```javascript
HLTV.getMatchesStats({startDate: '2017-07-10', endDate: '2017-07-18'}).then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/MatchStats.ts)**

***


#### getMatchStats

Parses info from the all maps stats page (`hltv.org/stats/matches/*/*`)

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
| id | number | - | - |
```javascript
HLTV.getMatchStats({id: 62979}).then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullMatchStats.ts#L40)**

***


#### getMatchMapStats

Parses info from the single map stats page (`hltv.org/stats/matches/mapstatsid/*/*`)

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
| id | number | - | - |
```javascript
HLTV.getMatchMapStats({id: 49968}).then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullMatchMapStats.ts#L63)**

***

#### getResults

Parses all matches from the `hltv.org/results/` page

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
pages | number | 1 | Number of pages with results to be parsed |
teamID | number? | - | ID of specific team |
eventID | number? | - | ID of specific event |
contentFilters | [ContentFilter[]](https://github.com/gigobyte/HLTV/blob/master/src/enums/ContentFilter.ts)? | [] | Add filter of the content |

```javascript
// Note: if you pass `eventID` to getResults you cannot pass a `pages` parameter
// since HLTV doesn't have pages for the event filter.
HLTV.getResults({pages: 2}).then((res) => {
  ...
})
```
**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/MatchResult.ts)**

***

#### getStreams

Parses all streams present on the front page of HLTV

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
loadLinks | boolean | false | Enables parsing of the stream links. Its an option since it can slow down the response (every stream is a separate request).

```javascript
HLTV.getStreams().then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullStream.ts)**

***

#### getRecentThreads

Parses the latest threads on the front page of HLTV

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
| - | - | - | - |

```javascript
HLTV.getRecentThreads().then((res) => {
  ...
})
```
**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/Thread.ts)**

#### getTeamRanking

Parses the info from the `hltv.org/ranking/teams/` page

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
| year | string? | - | - |
| month | string? | - | Must be lowercase and in MMMM format |
| day | string? | - | - |
| country | string? | - | Must be capitalized (`'Brazil'`, `'France'` etc)

```javascript
// If you don't provide a filter the latest ranking will be parsed
HLTV.getTeamRanking()
HLTV.getTeamRanking({country: 'Thailand'})
HLTV.getTeamRanking({year: '2017', month: 'may', day: '29'}).then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/TeamRanking.ts)**

***

#### getTeam

Parses the info from the `hltv.org/team/` page

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
id | number | - | The team id

```javascript
HLTV.getTeam({id: 6137}).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullTeam.ts)**

***

#### getTeamStats

Parses the info from the `hltv.org/stats/teams/` page

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
id | number | - | The team id

```javascript
HLTV.getTeamStats({id: 6137}).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullTeamStats.ts)**

***

#### getPlayer

Parses the info from the `hltv.org/player/` page

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
id | number | - | The player id

```javascript
HLTV.getPlayer({id: 6137}).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullPlayer.ts)**

***

#### getPlayerByName

Same as getPlayer but accepts a player name instead of ID.

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
name | string | - | The player name

```javascript
HLTV.getPlayerByName({name: "chrisJ"}).then(res => {
    ...
})
```

**[See getPlayer schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullPlayer.ts)**

#### getPlayerStats

Parses the info from `hltv.org/stats/players/*`


Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
id | number | - | - |
startDate | string | - | - |
endDate | string | - | - |
matchType | [MatchType](https://github.com/gigobyte/HLTV/blob/master/src/enums/MatchType.ts)? | - | - |
rankingFilter | [RankingFilter](https://github.com/gigobyte/HLTV/blob/master/src/enums/RankingFilter.ts)? | - | - |

```javascript
HLTV.getPlayerStats({id: 7998}).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullPlayerStats.ts)**

***

#### getPlayerRanking

Parses the info from `hltv.org/stats/players` page

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
startDate | string? | - | - |
endDate | string? | - | - |
matchType | [MatchType](https://github.com/gigobyte/HLTV/blob/master/src/enums/MatchType.ts)? | - | - |
rankingFilter | [RankingFilter](https://github.com/gigobyte/HLTV/blob/master/src/enums/RankingFilter.ts)? | - | - |


```javascript
// If you don't provide a filter the latest ranking will be parsed
HLTV.getPlayerRanking({startDate: '2018-07-01', endDate: '2018-10-01'}).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/PlayerRanking.ts)**

***

### getEvents

Parses the info from the `hltv.org/events` page

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
size | [EventSize](https://github.com/gigobyte/HLTV/blob/master/src/enums/EventSize.ts)? | - | Event size type. (EventSize.Small, EventSize.Big). Default (empty) combines both.

```javascript
HLTV.getEvents().then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/EventResult.ts)**

***

### getEvent

Parses the info from the `hltv.org/event/` page

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
id | number | - | The event id

```javascript
HLTV.getEvent({id: 3389}).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullEvent.ts)**

***

#### connectToScorebot

Presents an interface to receive data when the HLTV scorebot updates

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
| id | number | - | The match ID |
| onScoreboardUpdate | function? | - | Callback that is called when there is new scoreboard data |
| onLogUpdate | function? | - | Callback that is called when there is new game log data |
| onFullLogUpdate | function? | - | It's still unclear when this is called and with what data, if you find out please let me know!
| onConnect | function? | - | Callback that is called when a connection with the scorebot is established |
| onDisconnect | function? | - | Callback that is called when the scorebot disconnects |

```javascript
HLTV.connectToScorebot({id: 2311609, onScoreboardUpdate: (data, done) => {
    // if you call done() the socket connection will close.
}, onLogUpdate: (data, done) => {
    ...
}})

```

The ```onLogUpdate``` callback is passed an [LogUpdate](https://github.com/gigobyte/HLTV/blob/master/src/models/LogUpdate.ts) object

The ```onScoreboardUpdate``` callback is passed an [ScoreboardUpdate](https://github.com/gigobyte/HLTV/blob/master/src/models/ScoreboardUpdate.ts) object
