<h1 align="center">
  <img src="http://www.archiveteam.org/images/6/69/HLTV_logo.png" alt="pyarray logo" width="200">
  <br>
  The unofficial HLTV Node.js API
  <br>
</h1>

## Installation

```bash
npm install hltv --save
```

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

Parameters | Type | Default Value
---|---|---|
None | - | - |
```javascript
hltv.getMatches().then((res) => {
  ...
})
```
The callback receives an array of objects with the following schema:

Property | Type | Note
---|---|---|
time | string | Will be undefined if the match is live or finished
team1 | string
team1Id | string
team2 | string 
team2Id | string
map | string | Only exists if the match is BO1
format | string |
label | string | Mainly used when the teams are still unknown (e.g. "iBP Masters Grand Final")
id | string
live | boolean 
finished | boolean

***

#### getLatestResults

Parses all matches from the `hltv.org/results/` page

Parameters | Type | Default Value
---|---|---|
pages | int | 1 |

```javascript
hltv.getLatestResults(2).then((res) => {
  ...
})
```

The callback receives an array of objects with the following schema:

Property | Type | Note
---|---|---|
result | string | e.g. `'2 - 0'` or `'16 - 9'`
team1 | string
team1Id | string
team2 | string 
team2Id | string
map | string | Only exists if the match is BO1
format | string
id | string
