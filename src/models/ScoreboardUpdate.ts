import WinType from '../enums/WinType'

export interface ScoreboardPlayer {
    steamId: string,
    dbId: number,
    name: string,
    score: number,
    death: number,
    assists: number,
    alive: boolean,
    money: number,
    damagePrRound: number,
    hp: number,
    kevlar: boolean,
    helmet: boolean,
    nick: string
}

export interface ScoreboardRound {
    type: WinType,
    roundOrdinal: number,
    survivingPlayers: number
}

export interface ScoreboardUpdate {
    TERRORIST: ScoreboardPlayer[],
    CT: ScoreboardPlayer[]
    ctMatchHistory: {
        firstHalf: ScoreboardRound[],
        secondHalf: ScoreboardRound[]
    },
    terroristMatchHistory: {
        firstHalf: ScoreboardRound[],
        secondHalf: ScoreboardRound[]
    },
    bombPlanted: boolean,
    mapName: string,
    terroristTeamName: string,
    ctTeamName: string,
    currentRound: number,
    counterTerroristScore: number,
    terroristScore: number,
    ctTeamId: number,
    tTeamId: number,
    frozen: boolean
}

export default ScoreboardUpdate
