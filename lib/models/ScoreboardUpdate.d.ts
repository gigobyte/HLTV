import WinType from '../enums/WinType';
export interface ScoreboardPlayer {
    steamId: string;
    dbId: number;
    name: string;
    score: number;
    death: number;
    assists: number;
    alive: boolean;
    rating: number;
    money: number;
    damagePrRound: number;
}
export interface ScoreboardRound {
    type: WinType;
    roundOrdinal: number;
}
export interface ScoreboardUpdate {
    TERRORIST: ScoreboardPlayer[];
    CT: ScoreboardPlayer[];
    ctMatchHistory: {
        firstHalf: ScoreboardRound[];
        secondHalf: ScoreboardRound[];
    };
    terroristMatchHistory: {
        firstHalf: ScoreboardRound[];
        secondHalf: ScoreboardRound[];
    };
    bombPlanted: boolean;
    mapName: string;
    terroristTeamName: string;
    ctTeamName: string;
    currentRound: number;
    counterTerroristScore: number;
    terroristScore: number;
    ctTeamId: number;
    tTeamId: number;
}
export default ScoreboardUpdate;
