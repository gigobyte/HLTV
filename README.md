[![Build Status](https://travis-ci.org/gigobyte/HLTV.svg?branch=master)](https://travis-ci.org/gigobyte/HLTV)
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
label | string | Mainly used when the teams are still unknown (e.g. "iBP Masters Grand Final")
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
result | string | e.g. `'2 - 0'` or `'16 - 9'`
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
name | string |
category | string | e.g. `"Caster"` or `"Female player"`
country | string | An ISO 3166 code
hltvLink | string | 
realLink | string | Only if the `loadLinks` flag is enabled
viewers | int
