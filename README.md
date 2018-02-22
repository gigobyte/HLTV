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
  - [getMatchMapStats](#getmatchmapstats)
  - [getResults](#getresults)
  - [getStreams](#getstreams)
  - [getRecentThreads](#getrecentthreads)
  - [getTeamRanking](#getteamranking)
  - [getTeam](#getteam)
  - [getTeamStats](#getteamstats)
  - [getPlayer](#getplayer)
  - [connectToScorebot](#connecttoscorebot)

## Installation

[![NPM](https://nodei.co/npm/hltv.png)](https://nodei.co/npm/hltv/)

## Usage

```javascript
import HLTV from 'hltv'
// Or if you're stuck with CommonJS
const { HLTV } = require('hltv')
```

#### Configuration

You can create an instance of HLTV with a custom config.

```javascript
const myHLTV = HLTV.createInstance({hltvUrl: 'my-proxy-server'})
```

**[See config schema](https://github.com/gigobyte/HLTV/blob/master/src/models/HLTVConfig.ts)**

## API

#### getMatch

Parses most information from a match page

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
id | int | - | The match id

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
pages | int | 1 | Number of pages with results to be parsed |

```javascript
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
| year | string | - | - |
| month | string | - | Must be lowercase and in MMMM format |
| day | string | - | - |
| country | string | - | Must be capitalized (`'Brazil'`, `'France'` etc)

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
id | int | - | The team id

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
id | int | - | The team id

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
id | int | - | The player id

```javascript
HLTV.getPlayer({id: 6137}).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/models/FullPlayer.ts)**

***

#### connectToScorebot

Presents an interface to receive data when the HLTV scorebot updates

**NOTE: While `connectToScorebot` returns a Promise, the promise will never resolve. Instead you should pass the callbacks described below.**

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
| id | int | - | The match ID |
| onScoreboardUpdate | function? | - | Callback that is called when there is new scoreboard data |
| onLogUpdate | function? | - | Callback that is called when there is new game log data |
| onConnect | function? | - | Callback that is called when a connection with the scorebot is established |
| onDisconnect | function? | - | Callback that is called when the scorebot disconnects |

```javascript
HLTV.connectToScorebot({id: 2311609, onScoreboardUpdate: (data) => {
    ...
}, onLogUpdate: (data) => {
    ...
}})

```

The ```onLogUpdate``` callback is passed an [LogUpdate](https://github.com/gigobyte/HLTV/blob/master/src/models/LogUpdate.ts) object

The ```onScoreboardUpdate``` callback is passed an [ScoreboardUpdate](https://github.com/gigobyte/HLTV/blob/master/src/models/ScoreboardUpdate.ts) object
