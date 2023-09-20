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
  - [getStreams](#getstreams)
  - [getRecentThreads](#getrecentthreads)
  - [getTeamRanking](#getteamranking)
  - [getTeam](#getteam)
  - [getTeamByName](#getteambyname)
  - [getTeamStats](#getteamstats)
  - [getPlayer](#getplayer)
  - [getPlayerByName](#getplayerbyname)
  - [getPlayerStats](#getplayerstats)
  - [getPlayerRanking](#getplayerranking)
  - [getEvents](#getevents)
  - [getEvent](#getevent)
  - [getEventByName](#geteventbyname)
  - [getPastEvents](#getpastevents)
  - [getResults](#getresults)
  - [getNews](#getnews)
  - [connectToScorebot](#connecttoscorebot)
  - [TEAM_PLACEHOLDER_IMAGE](#team_placeholder_image)
  - [PLAYER_PLACEHOLDER_IMAGE](#player_placeholder_image)

## Installation

[![NPM](https://nodei.co/npm/hltv.png)](https://nodei.co/npm/hltv/)

## Usage

:warning: **WARNING:** Abusing this library will likely result in an IP ban from HLTV simply because of Cloudflare bot protection.

Please use with caution and try to limit the rate and amount of your requests if you value your access to HLTV. Each method has the number of requests it makes to HLTV documented in this README. This is important if you want to implement some kind of throttling yourself.

```javascript
// In .mjs files and if you're using a bundler
import HLTV from 'hltv'
// Or if you're stuck with CommonJS
const { HLTV } = require('hltv')
```

#### Configuration

You can create an instance of HLTV with a custom config if you want to.

|  Option   |                Type                |         Default value          |                                   Description                                   |
| :-------: | :--------------------------------: | :----------------------------: | :-----------------------------------------------------------------------------: |
| loadPage  | (url: string) => Promise\<string\> | based on the 'got' library |      Function that will be called when the library makes a request to HLTV      |
| httpAgent |             HttpAgent              |           HttpsAgent           | Http agent used when sending a request and connecting to the scorebot websocket |

```javascript
const myHLTV = HLTV.createInstance({ loadPage: (url) => axios.get(url) })
// or
const myHLTV = HLTV.createInstance({ loadPage: (url) => fetch(url) })
// or you can just use the HLTV export directly to use the default settings
import HLTV from 'hltv'

HLTV.getMatch({ ... })
```

**[See config schema](https://github.com/gigobyte/HLTV/blob/master/src/config.ts)**

## API

#### getMatch

Parses most information from a match page (1 request)

| Option |  Type  | Default value | Description  |
| :----: | :----: | :-----------: | :----------: |
|   id   | number |       -       | The match id |

```javascript
HLTV.getMatch({ id: 2306295 }).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getMatch.ts#L79)**

---

#### getMatches

Parses all matches from the `hltv.org/matches/` page (1 request)

|  Option   |                                              Type                                              | Default Value |                          Description                           |
| :-------: | :--------------------------------------------------------------------------------------------: | :-----------: | :------------------------------------------------------------: |
| eventIds  |                                           number[]?                                            |       -       |                  Filter matches by event IDs.                  |
| eventType | [MatchEventType](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getMatches.ts#L8)? |       -       |                 Filter matches by event type.                  |
|  filter   |  [MatchFilter](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getMatches.ts#L14)?  |       -       | Filter matches by pre-set categories. Overrides other filters. |
|  teamIds  |                                           number[]?                                            |       -       |                               -                                |

```javascript
HLTV.getMatches().then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getMatches.ts#L25)**

#### getMatchesStats

Parses all matches from the `hltv.org/stats/matches` page (1 request per page of results)

|          Option          |                                            Type                                            | Default Value |                Description                 |
| :----------------------: | :----------------------------------------------------------------------------------------: | :-----------: | :----------------------------------------: |
|        startDate         |                                          string?                                           |       -       |                     -                      |
|         endDate          |                                          string?                                           |       -       |                     -                      |
|        matchType         |     [MatchType](https://github.com/gigobyte/HLTV/blob/master/src/shared/MatchType.ts)?     |       -       |                     -                      |
|           maps           |      [GameMap](https://github.com/gigobyte/HLTV/blob/master/src/shared/GameMap.ts)[]?      |       -       |                     -                      |
|      rankingFilter       | [RankingFilter](https://github.com/gigobyte/HLTV/blob/master/src/shared/RankingFilter.ts)? |       -       |                     -                      |
| delayBetweenPageRequests |                                          number?                                           |       0       | Used to prevent CloudFlare throttling (ms) |

```javascript
// ! BE CAREFUL, THIS CAN MAKE A LOT OF REQUESTS IF THERE ARE A LOT OF PAGES
HLTV.getMatchesStats({ startDate: '2017-07-10', endDate: '2017-07-18' }).then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getMatchStats.ts#L15)**

---

#### getMatchStats

Parses info from the `hltv.org/stats/matches/*/*` all maps stats page (1 request)

| Option |  Type  | Default Value | Description |
| :----: | :----: | :-----------: | :---------: |
|   id   | number |       -       |      -      |

```javascript
HLTV.getMatchStats({ id: 62979 }).then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getMatchStats.ts#L15)**

---

#### getMatchMapStats

Parses info from the `hltv.org/stats/matches/mapstatsid/*/*` single map stats page (2 requests)

| Option |  Type  | Default Value | Description |
| :----: | :----: | :-----------: | :---------: |
|   id   | number |       -       |      -      |

```javascript
HLTV.getMatchMapStats({ id: 49968 }).then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getMatchMapStats.ts#L80)**

---

#### getStreams

Parses all streams present on the front page of HLTV (1 request + 1 request per stream if `loadLinks` is true)

|  Option   |  Type   | Default Value |                                      Description                                      |
| :-------: | :-----: | :-----------: | :-----------------------------------------------------------------------------------: |
| loadLinks | boolean |     false     | Enables parsing of the stream links (every stream is an additional separate request). |

```javascript
HLTV.getStreams().then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getStreams.ts#L12)**

---

#### getRecentThreads

Parses the latest threads on the front page of HLTV (1 request)

| Option | Type | Default Value | Description |
| :----: | :--: | :-----------: | :---------: |
|   -    |  -   |       -       |      -      |

```javascript
HLTV.getRecentThreads().then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getRecentThreads.ts#L11)**

#### getTeamRanking

Parses the info from the `hltv.org/ranking/teams/` page (1 request)

| Option  |                                                                      Type                                                                      | Default Value |                   Description                    |
| :-----: | :--------------------------------------------------------------------------------------------------------------------------------------------: | :-----------: | :----------------------------------------------: |
|  year   |                                          2015 \| 2016 \| 2017 \| 2018 \| 2019 \| 2020 \| 2021 \| 2022                                          |       -       |                        -                         |
|  month  | 'january' \| 'february' \| 'march' \| 'april' \| 'may' \| 'june' \| 'july' \| 'august' \| 'september' \| 'october' \| 'november' \| 'december' |       -       |                        -                         |
|   day   |                                                                    number?                                                                     |       -       |                        -                         |
| country |                                                                    string?                                                                     |       -       | Must be capitalized (`'Brazil'`, `'France'` etc) |

```javascript
// If you don't provide a filter the latest ranking will be parsed
HLTV.getTeamRanking()
HLTV.getTeamRanking({ country: 'Thailand' })
HLTV.getTeamRanking({ year: 2017, month: 'may', day: 29 }).then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getTeamRanking.ts#L6)**

---

#### getTeam

Parses the info from the `hltv.org/team/` page (1 request)

| Option |  Type  | Default value | Description |
| :----: | :----: | :-----------: | :---------: |
|   id   | number |       -       | The team id |

```javascript
HLTV.getTeam({ id: 6137 }).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getTeam.ts#L21)**

---

#### getTeamByName

Same as getTeam but accepts a team name instead of ID. (2 requests)

| Option |  Type  | Default value |  Description  |
| :----: | :----: | :-----------: | :-----------: |
|  name  | string |       -       | The team name |

```javascript
HLTV.getTeamByName({ name: "BIG" }).then(res => {
    ...
})
```

**[See getTeam schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getTeam.ts#L21)**

---

#### getTeamStats

Parses the info from the `hltv.org/stats/teams/*` page (4 requests + 1 more if `currentRosterOnly` is true)

|      Option       |                                            Type                                            | Default value |                Description                 |
| :---------------: | :----------------------------------------------------------------------------------------: | :-----------: | :----------------------------------------: |
|        id         |                                           number                                           |       -       |                The team id                 |
| currentRosterOnly |                                          boolean?                                          |     false     | Return stats about the current roster only |
|     startDate     |                                          string?                                           |       -       |                     -                      |
|      endDate      |                                          string?                                           |       -       |                     -                      |
|     matchType     |     [MatchType](https://github.com/gigobyte/HLTV/blob/master/src/shared/MatchType.ts)?     |       -       |                     -                      |
|   rankingFilter   | [RankingFilter](https://github.com/gigobyte/HLTV/blob/master/src/shared/RankingFilter.ts)? |       -       |                     -                      |
|       maps        |      [GameMap](https://github.com/gigobyte/HLTV/blob/master/src/shared/GameMap.ts)[]?      |       -       |                     -                      |
|      bestOfX      |  [BestOfFilter](https://github.com/gigobyte/HLTV/blob/master/src/shared/BestOfFilter.ts)?  |       -       |                     -                      |

```javascript
HLTV.getTeamStats({ id: 6137 }).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getTeamStats.ts#L28)**

---

#### getPlayer

Parses the info from the `hltv.org/player/*` page (1 request)

| Option |  Type  | Default value |  Description  |
| :----: | :----: | :-----------: | :-----------: |
|   id   | number |       -       | The player id |

```javascript
HLTV.getPlayer({ id: 6137 }).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getPlayer.ts#L20)**

---

#### getPlayerByName

Same as getPlayer but accepts a player name instead of ID. (2 requests)

| Option |  Type  | Default value |   Description   |
| :----: | :----: | :-----------: | :-------------: |
|  name  | string |       -       | The player name |

```javascript
HLTV.getPlayerByName({ name: "chrisJ" }).then(res => {
    ...
})
```

**[See getPlayer schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getPlayer.ts#L20)**

#### getPlayerStats

Parses the info from `hltv.org/stats/players/*` (3 requests)

|    Option     |                                            Type                                            | Default value | Description |
| :-----------: | :----------------------------------------------------------------------------------------: | :-----------: | :---------: |
|      id       |                                           number                                           |       -       |      -      |
|   startDate   |                                          string?                                           |       -       |      -      |
|    endDate    |                                          string?                                           |       -       |      -      |
|   matchType   |     [MatchType](https://github.com/gigobyte/HLTV/blob/master/src/shared/MatchType.ts)?     |       -       |      -      |
| rankingFilter | [RankingFilter](https://github.com/gigobyte/HLTV/blob/master/src/shared/RankingFilter.ts)? |       -       |      -      |
|     maps      |      [GameMap](https://github.com/gigobyte/HLTV/blob/master/src/shared/GameMap.ts)[]?      |       -       |      -      |
|    bestOfX    |  [BestOfFilter](https://github.com/gigobyte/HLTV/blob/master/src/shared/BestOfFilter.ts)?  |       -       |      -      |
|   eventIds    |                                         number[]?                                          |       -       |      -      |

```javascript
HLTV.getPlayerStats({ id: 7998 }).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getPlayerStats.ts#L23)**

---

#### getPlayerRanking

Parses the info from `hltv.org/stats/players` page (1 request)

|    Option     |                                            Type                                            | Default value | Description |
| :-----------: | :----------------------------------------------------------------------------------------: | :-----------: | :---------: |
|   startDate   |                                          string?                                           |       -       |      -      |
|    endDate    |                                          string?                                           |       -       |      -      |
|   matchType   |     [MatchType](https://github.com/gigobyte/HLTV/blob/master/src/shared/MatchType.ts)?     |       -       |      -      |
| rankingFilter | [RankingFilter](https://github.com/gigobyte/HLTV/blob/master/src/shared/RankingFilter.ts)? |       -       |      -      |
|     maps      |      [GameMap](https://github.com/gigobyte/HLTV/blob/master/src/shared/GameMap.ts)[]?      |       -       |      -      |
|  minMapCount  |                                          number?                                           |       -       |      -      |
|   countries   |                                          string[]                                          |       -       |      -      |
|    bestOfX    |  [BestOfFilter](https://github.com/gigobyte/HLTV/blob/master/src/shared/BestOfFilter.ts)?  |       -       |      -      |

```javascript
// If you don't provide a filter the latest ranking will be parsed
HLTV.getPlayerRanking({ startDate: '2018-07-01', endDate: '2018-10-01' }).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getPlayerRanking.ts#L12)**

---

#### getEvents

Parses the info from the `hltv.org/events` page (1 request)

|       Option       |                                        Type                                        | Default value |                     Description                     |
| :----------------: | :--------------------------------------------------------------------------------: | :-----------: | :-------------------------------------------------: |
|     eventType      | [EventType](https://github.com/gigobyte/HLTV/blob/master/src/shared/EventType.ts)? |       -       | Event type e.g. EventSize.Major, EventSize.LocalLAN |
|    prizePoolMin    |                                      number?                                       |       -       |              Minimum prize pool (USD$)              |
|    prizePoolMax    |                                      number?                                       |       -       |              Maximum prize pool (USD$)              |
|  attendingTeamIds  |                                     number[]?                                      |       -       |                          -                          |
| attendingPlayerIds |                                     number[]?                                      |       -       |                          -                          |

```javascript
HLTV.getEvents().then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getEvents.ts#L8)**

---

#### getEvent

Parses the info from the `hltv.org/event/` page (1 request)

| Option |  Type  | Default value | Description  |
| :----: | :----: | :-----------: | :----------: |
|   id   | number |       -       | The event id |

```javascript
HLTV.getEvent({ id: 3389 }).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getEvent.ts#L43)**

---

#### getEventByName

Same as getEvent but accepts a event name instead of ID. (2 requests)

| Option |  Type  | Default value |  Description   |
| :----: | :----: | :-----------: | :------------: |
|  name  | string |       -       | The event name |

```javascript
HLTV.getEventByName({ name: "IEM Katowice 2019" }).then(res => {
    ...
})
```

**[See getEvent schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getEvent.ts#L43)**

---

#### getPastEvents

Parses the info from the `hltv.org/events/archive` page (1 request per page of results)

|          Option          |                                        Type                                        | Default value |                     Description                     |
| :----------------------: | :--------------------------------------------------------------------------------: | :-----------: | :-------------------------------------------------: |
|        eventType         | [EventType](https://github.com/gigobyte/HLTV/blob/master/src/shared/EventType.ts)? |       -       | Event type e.g. EventSize.Major, EventSize.LocalLAN |
|        startDate         |                                      string?                                       |       -       |                          -                          |
|         endDate          |                                      string?                                       |       -       |                          -                          |
|       prizePoolMin       |                                      number?                                       |       -       |              Minimum prize pool (USD$)              |
|       prizePoolMax       |                                      number?                                       |       -       |              Maximum prize pool (USD$)              |
|     attendingTeamIds     |                                     number[]?                                      |       -       |                          -                          |
|    attendingPlayerIds    |                                     number[]?                                      |       -       |                          -                          |
| delayBetweenPageRequests |                                      number?                                       |       0       |     Used to prevent CloudFlare throttling (ms)      |

```javascript
// ! BE CAREFUL, THIS CAN MAKE A LOT OF REQUESTS IF THERE ARE A LOT OF PAGES
HLTV.getPastEvents({ startDate: '2019-01-01', endDate: '2019-01-10' }).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getPastEvents.ts#L8)**

---

#### getResults

Parses the info from the `hltv.org/results` page (1 request per page of results)

|          Option          |                                              Type                                               | Default value |                Description                 |
| :----------------------: | :---------------------------------------------------------------------------------------------: | :-----------: | :----------------------------------------: |
|        startDate         |                                             string?                                             |       -       |                     -                      |
|         endDate          |                                             string?                                             |       -       |                     -                      |
|        matchType         | [ResultMatchType](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getResults.ts#L9)? |       -       |                     -                      |
|          stars           |                                      1 \| 2 \| 3 \| 4 \| 5                                      |       -       |                     -                      |
|           maps           |        [GameMap](https://github.com/gigobyte/HLTV/blob/master/src/shared/GameMap.ts)[]?         |       -       |                     -                      |
|        countries         |                                            string[]                                             |       -       |                     -                      |
|         bestOfX          |    [BestOfFilter](https://github.com/gigobyte/HLTV/blob/master/src/shared/BestOfFilter.ts)?     |       -       |                     -                      |
|      contentFilters      | [ContentFilter](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getResults.ts#L14)?  |       -       |                     -                      |
|         eventIds         |                                            number[]?                                            |       -       |                     -                      |
|        playerIds         |                                            number[]?                                            |       -       |                     -                      |
|         teamIds          |                                            number[]?                                            |       -       |                     -                      |
|           game           |    [GameType](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getResults.ts#L21)?    |       -       |                     -                      |
| delayBetweenPageRequests |                                             number?                                             |       0       | Used to prevent CloudFlare throttling (ms) |

```javascript
// ! BE CAREFUL, THIS CAN MAKE A LOT OF REQUESTS IF THERE ARE A LOT OF PAGES
HLTV.getResults({ eventIds: [1617], bestOfX: [BestOfFilter.BO3] }).then(res => {
    ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getResults.ts#L31)**

#### getNews

Parses the info from the `hltv.org/news/archive/` page (1 request)

|  Option  |                                                                      Type                                                                      | Default Value |                        Description                         |
| :------: | :--------------------------------------------------------------------------------------------------------------------------------------------: | :-----------: | :--------------------------------------------------------: |
|   year   |  2005 \| 2006 \| 2007 \| 2008 \| 2009 \| 2010 \| 2011 \| 2012 \| 2013 \| 2014 \| 2015 \| 2016 \| 2017 \| 2018 \| 2019 \| 2020 \| 2021 \| 2022  |       -       | If you specify a `year` you must specify a `month` as well |
|  month   | 'january' \| 'february' \| 'march' \| 'april' \| 'may' \| 'june' \| 'july' \| 'august' \| 'september' \| 'october' \| 'november' \| 'december' |       -       | If you specify a `month` you must specify a `year` as well |
| eventIds |                                                                   number[]?                                                                    |       -       |                             -                              |

```javascript
// If you don't provide a filter the latest news will be parsed
HLTV.getNews()
HLTV.getNews({ eventIds: [3491] })
HLTV.getNews({ year: 2020, month: 'may' }).then((res) => {
  ...
})
```

**[See schema](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/getNews.ts#L7)**

#### connectToScorebot

Presents an interface to receive data when the HLTV scorebot updates

|       Option       |   Type    | Default Value |                                          Description                                           |
| :----------------: | :-------: | :-----------: | :--------------------------------------------------------------------------------------------: |
|         id         |  number   |       -       |                                          The match ID                                          |
| onScoreboardUpdate | function? |       -       |                   Callback that is called when there is new scoreboard data                    |
|    onLogUpdate     | function? |       -       |                    Callback that is called when there is new game log data                     |
|  onFullLogUpdate   | function? |       -       | It's still unclear when this is called and with what data, if you find out please let me know! |
|     onConnect      | function? |       -       |           Callback that is called when a connection with the scorebot is established           |
|    onDisconnect    | function? |       -       |                     Callback that is called when the scorebot disconnects                      |

```javascript
HLTV.connectToScorebot({
  id: 2311609,
  onScoreboardUpdate: (data, done) => {
    // if you call done() the socket connection will close.
  },
  onLogUpdate: (data, done) => {
      ...
  }
})

```

The `onLogUpdate` callback is passed an [LogUpdate](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/connectToScorebot.ts#L117) object

The `onScoreboardUpdate` callback is passed an [ScoreboardUpdate](https://github.com/gigobyte/HLTV/blob/master/src/endpoints/connectToScorebot.ts#L161) object

---

#### TEAM_PLACEHOLDER_IMAGE

```javascript
HLTV.TEAM_PLACEHOLDER_IMAGE
// https://www.hltv.org/img/static/team/placeholder.svg
```

---

#### PLAYER_PLACEHOLDER_IMAGE

```javascript
HLTV.PLAYER_PLACEHOLDER_IMAGE
// https://static.hltv.org/images/playerprofile/bodyshot/unknown.png
```
