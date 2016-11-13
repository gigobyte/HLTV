[![Dependency Status](https://david-dm.org/gigobyte/hltv.svg)](https://david-dm.org/gigobyte/hltv)
[![devDependencies Status](https://david-dm.org/gigobyte/hltv/dev-status.svg)](https://david-dm.org/gigobyte/hltv?type=dev)

<h1 align="center">
  <img src="http://www.archiveteam.org/images/6/69/HLTV_logo.png" alt="pyarray logo" width="200">
  <br>
  The unofficial HLTV Node.js API
  <br>
</h1>

#Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [getMatch](#getmatch)
  - [getMatches](#getmatches)
  - [getLatestResults](#getlatestresults)
  - [getStreams](#getstreams)

## Installation

[![NPM](https://nodei.co/npm/hltv.png)](https://nodei.co/npm/hltv/)

## Usage

```javascript
import HLTV from 'hltv'
// Or if you're stuck with CommonJS
const HLTV = require('hltv')

//create an object before using the API
const hltv = new HLTV()
```

## API

#### getMatch

Parses most information from a match page

Option | Type | Default value | Description |
:---:|:---:|:---:|:---:|
id | string | - | The match id

```javascript
hltv.getMatch({id: '2306295-sk-natus-vincere-eleague-season-2'}).then(res => {
    ...
})
```

Results in an object with the following schema:

Property | Type | Note
---|---|---|
team1 | string 
team1Id | int
team2 | string
team2Id | int
date | string | e.g. `"12th of November 2016 22:30"`
format | string
additionalInfo | string | e.g. `"* Grand final"`
event | object | Object schema: `{name: string, link: string}`
maps | [objects] | Object schema: `{map: string, result: string}`
streams | [objects] | Object schema: `{name: string, link: string}`
highlights | array
players | array
title | string | Mainly used when the teams are still unknown (e.g. `"iBP Masters Grand Final"`)

***

#### getMatches

Parses all matches from the `hltv.org/matches/` page

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
- | - | - | - |
```javascript
hltv.getMatches().then((res) => {
  ...
})
```
Results in an array of objects with the following schema:

Property | Type | Note
---|---|---|
time | string | Will be undefined if the match is live or finished
team1 | string
team1Id | int
team2 | string 
team2Id | int
map | string | Only exists if the match is BO1
format | string |
label | string | Mainly used when the teams are still unknown (e.g. `"iBP Masters Grand Final"`)
id | string
live | boolean 
finished | boolean

***

#### getLatestResults

Parses all matches from the `hltv.org/results/` page

Option | Type | Default Value | Description |
:---:|:---:|:---:|:---:|
pages | int | 1 | Number of pages with results to be parsed |

```javascript
hltv.getLatestResults({pages: 2}).then((res) => {
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
map | string | Only exists if the match is BO1
format | string
id | string

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
