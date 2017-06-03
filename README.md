[![Dependency Status](https://david-dm.org/gigobyte/hltv.svg)](https://david-dm.org/gigobyte/hltv)
[![devDependencies Status](https://david-dm.org/gigobyte/hltv/dev-status.svg)](https://david-dm.org/gigobyte/hltv?type=dev)

<h1 align="center">
  <img src="https://www.hltv.org/img/static/TopLogo2x.png" alt="pyarray logo" width="200">
  <br>
  The unofficial HLTV Node.js API
  <br>
</h1>

:star: This package supports the new HLTV that was deployed on [May 22nd](https://www.hltv.org/news/20530/a-new-beginning-for-hltvorg).

Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [getMatch](#getmatch)
  - [getMatches](#getmatches)
  - [getLatestResults](#getlatestresults)
  - [getStreams](#getstreams)
  - [getActiveThreads](#getactivethreads)

## Installation

[![NPM](https://nodei.co/npm/hltv.png)](https://nodei.co/npm/hltv/)

## Usage

```javascript
import HLTV from 'hltv'
// Or if you're stuck with CommonJS
const HLTV = require('hltv')
```

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

Results in an object with the following schema:

Property | Type | Note
---|---|---|
team1 | string?
team1Id | int?
team2 | string?
team2Id | int?
date | int | Unix timestamp
format | string
additionalInfo | string? | e.g. `"* Grand final"`
event | object | Object schema: `{name: string, link: string}`
maps | [objects] | Object schema: `{map: string, result: string}`
streams | [objects] | Object schema: `{name: string, link: string}`
players | object | Object schema: `{$team1$: [string], $team2$: [string]}`
title | string? | Exists when the teams are still unknown (e.g. `"iBP Masters Grand Final"`)

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
Results in an array of objects with the following schema:

Property | Type | Note
---|---|---|
date | int | Unix timestamp, will be undefined if the match is live
team1 | string?
team1Id | int?
team2 | string?
team2Id | int?
maps | [string]? | Only exists if the match is BO1 or if the match is live
format | string? |
label | string? | Exists when the teams are still unknown (e.g. `"iBP Masters Grand Final"`)
id | int
event | object | Object schema: `{name: string, id: int}`
live | boolean

***

#### getLatestResults

Parses all matches from the `hltv.org/results/` page

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
pages | int | 1 | Number of pages with results to be parsed |

```javascript
HLTV.getLatestResults({pages: 2}).then((res) => {
  ...
})
```

Results in an array of objects with the following schema:

Property | Type | Note
---|---|---|
result | string | e.g. `"2 - 0"` or `"16 - 9"`
team1 | string
team1Id | int
team2 | string
team2Id | int
maps | [string]? | Only exists if the match is BO1
format | string
id | string
event | object | Object schema: `{name: string, id: int}`

***

#### getStreams

Parses all streams present on the front page of HLTV

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
loadLinks | boolean | false | Enables parsing of the stream links. Its an option since it can slow down the response (every stream is a separate request).

```javascript
hltv.getStreams().then((res) => {
  ...
})
```

Results in an array of objects with the following schema:

Property | Type | Note
---|---|---|
name | string
category | string | e.g. `"Caster"` or `"Female player"`
country | string | An ISO 3166 code
hltvLink | string
realLink | string | Only if the `loadLinks` flag is enabled
viewers | int

***

#### getActiveThreads

Parses the latest threads on the front page of HLTV

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
| - | - | - | - |

```javascript
hltv.getActiveThreads().then((res) => {
  ...
})
```

Results in an array of objects with the following schema:

Property | Type | Note
---|---|---|
title | string
link | string
replies | int

***
