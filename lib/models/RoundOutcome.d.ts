export declare enum Outcome {
    CTWin = "ct_win",
    TWin = "t_win",
    BombDefused = "bomb_defused",
    BombExploded = "bomb_exploded",
}
export interface WeakRoundOutcome {
    outcome?: Outcome;
    score: string;
    tTeam: number;
    ctTeam: number;
}
interface RoundOutcome extends WeakRoundOutcome {
    outcome: Outcome;
}
export default RoundOutcome;
