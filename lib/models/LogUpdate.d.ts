import WinType from '../enums/WinType';
export declare type Side = 'CT' | 'TERRORIST' | 'SPECTATOR';
export declare type LogEvent = RoundStart | RoundEnd | Kill | BombDefused | BombPlanted | PlayerJoin | PlayerQuit;
export interface RoundStart {
    RoundStart: {};
}
export interface PlayerJoin {
    PlayerJoin: {
        playerName: string;
    };
}
export interface PlayerQuit {
    PlayerQuit: {
        playerName: string;
        playerSide: Side;
    };
}
export interface RoundEnd {
    RoundEnd: {
        counterTerroristScore: number;
        terroristScore: number;
        winner: Side;
        winType: WinType;
    };
}
export interface Kill {
    Kill: {
        killerName: string;
        killerSide: Side;
        victimName: string;
        victimSide: Side;
        weapon: string;
        headShot: boolean;
    };
}
export interface BombDefused {
    BombDefused: {
        playerName: string;
    };
}
export interface BombPlanted {
    BombPlanted: {
        playerName: string;
        ctPlayers: number;
        tPlayers: number;
    };
}
interface LogUpdate {
    log: LogEvent[];
}
export default LogUpdate;
