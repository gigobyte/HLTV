import { WinType } from '../enums/WinType'

export type Side = 'CT' | 'TERRORIST' | 'SPECTATOR'
export type LogEvent =
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

export interface RoundStart {
  RoundStart: {}
}

export interface MatchStarted {
  MatchStarted: {
    map: string
  }
}

export interface Restart {
  Restart: {}
}

export interface PlayerJoin {
  PlayerJoin: {
    playerName: string
    playerNick: string
  }
}

export interface PlayerQuit {
  PlayerQuit: {
    playerName: string
    playerNick: string
    playerSide: Side
  }
}

export interface RoundEnd {
  RoundEnd: {
    counterTerroristScore: number
    terroristScore: number
    winner: Side
    winType: WinType
  }
}

export interface Kill {
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
    flasherNick?: string
    flasherSide?: Side
  }
}

export interface Assist {
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

export interface Suicide {
  Suicide: {
    playerName: string
    playerNick: string
    side: Side
    weapon: string
  }
}

export interface BombDefused {
  BombDefused: {
    playerName: string
    playerNick: string
  }
}

export interface BombPlanted {
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
