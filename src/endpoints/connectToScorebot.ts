import * as io from 'socket.io-client'
import { fetchPage, generateRandomSuffix } from '../utils'
import { HLTVConfig } from '../config'

type Side = 'CT' | 'TERRORIST' | 'SPECTATOR'

type LogEvent =
  | RoundStart
  | RoundEnd
  | Restart
  | MatchStarted
  | Kill
  | Assist
  | Suicide
  | BombDefused
  | BombPlanted
  | PlayerJoin
  | PlayerQuit

interface RoundStart {
  RoundStart: {}
}

interface MatchStarted {
  MatchStarted: {
    map: string
  }
}

interface Restart {
  Restart: {}
}

interface PlayerJoin {
  PlayerJoin: {
    playerName: string
    playerNick: string
  }
}

interface PlayerQuit {
  PlayerQuit: {
    playerName: string
    playerNick: string
    playerSide: Side
  }
}

interface RoundEnd {
  RoundEnd: {
    counterTerroristScore: number
    terroristScore: number
    winner: Side
    winType: WinType
  }
}

interface Kill {
  Kill: {
    killerName: string
    killerNick: string
    killerSide: Side
    victimName: string
    victimSide: Side
    victimNick: string
    weapon: string
    headShot: boolean
    eventId: number
    victimX: number
    victimY: number
    killerX: number
    killerY: number
    killerId: number
    victimId: number
    flasherNick?: string
    flasherSide?: Side
  }
}

interface Assist {
  Assist: {
    assisterName: string
    assisterNick: string
    assisterSide: Side
    victimNick: string
    victimName: string
    victimSide: Side
    killEventId: number
  }
}

interface Suicide {
  Suicide: {
    playerName: string
    playerNick: string
    side: Side
    weapon: string
  }
}

interface BombDefused {
  BombDefused: {
    playerName: string
    playerNick: string
  }
}

interface BombPlanted {
  BombPlanted: {
    playerName: string
    playerNick: string
    ctPlayers: number
    tPlayers: number
  }
}

export interface LogUpdate {
  log: LogEvent[]
}

export interface ScoreboardPlayer {
  steamId: string
  dbId: number
  name: string
  score: number
  deaths: number
  assists: number
  alive: boolean
  money: number
  damagePrRound: number
  hp: number
  primaryWeapon?: string
  kevlar: boolean
  helmet: boolean
  nick: string
  hasDefuseKit: boolean
  advancedStats: {
    kast: number
    entryKills: number
    entryDeaths: number
    multiKillRounds: number
    oneOnXWins: number
    flashAssists: number
  }
}

export enum WinType {
  Lost = 'lost',
  TerroristsWin = 'Terrorists_Win',
  CTsWin = 'CTs_Win',
  TargetBombed = 'Target_Bombed',
  BombDefused = 'Bomb_Defused'
}

interface ScoreboardRound {
  type: WinType
  roundOrdinal: number
  survivingPlayers: number
}

export interface ScoreboardUpdate {
  TERRORIST: ScoreboardPlayer[]
  CT: ScoreboardPlayer[]
  ctMatchHistory: {
    firstHalf: ScoreboardRound[]
    secondHalf: ScoreboardRound[]
  }
  terroristMatchHistory: {
    firstHalf: ScoreboardRound[]
    secondHalf: ScoreboardRound[]
  }
  bombPlanted: boolean
  mapName: string
  terroristTeamName: string
  ctTeamName: string
  currentRound: number
  counterTerroristScore: number
  terroristScore: number
  ctTeamId: number
  tTeamId: number
  frozen: boolean
  live: boolean
  ctTeamScore: number
  tTeamScore: number
  startingCt: number
  startingT: number
}

type ConnectToScorebotParams = {
  id: number
  onScoreboardUpdate?: (data: ScoreboardUpdate, done: () => void) => any
  onLogUpdate?: (data: LogUpdate, done: () => void) => any
  onFullLogUpdate?: (data: unknown, done: () => void) => any
  onConnect?: () => any
  onDisconnect?: () => any
}

export const connectToScorebot =
  (config: HLTVConfig) =>
  ({
    id,
    onScoreboardUpdate,
    onLogUpdate,
    onFullLogUpdate,
    onConnect,
    onDisconnect
  }: ConnectToScorebotParams) => {
    fetchPage(
      `https://www.hltv.org/matches/${id}/${generateRandomSuffix()}`,
      config.loadPage
    ).then(($) => {
      const url = $('#scoreboardElement')
        .attr('data-scorebot-url')!
        .split(',')
        .pop()!
      const matchId = $('#scoreboardElement').attr('data-scorebot-id')

      const socket = io.connect(url, {
        agent: !config.httpAgent
      })

      const initObject = JSON.stringify({
        token: '',
        listId: matchId
      })

      let reconnected = false

      socket.on('connect', () => {
        const done = () => socket.close()

        if (onConnect) {
          onConnect()
        }

        if (!reconnected) {
          socket.emit('readyForMatch', initObject)
        }

        socket.on('scoreboard', (data: ScoreboardUpdate) => {
          if (onScoreboardUpdate) {
            onScoreboardUpdate(data, done)
          }
        })

        socket.on('log', (data: string) => {
          if (onLogUpdate) {
            onLogUpdate(JSON.parse(data), done)
          }
        })

        socket.on('fullLog', (data: any) => {
          if (onFullLogUpdate) {
            onFullLogUpdate(JSON.parse(data), done)
          }
        })
      })

      socket.on('reconnect', () => {
        reconnected = true
        socket.emit('readyForMatch', initObject)
      })

      socket.on('disconnect', () => {
        if (onDisconnect) {
          onDisconnect()
        }
      })
    })
  }
