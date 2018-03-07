export enum Outcome {
    CTWin = 'ct_win',
    TWin = 't_win',
    BombDefused = 'bomb_defused',
    BombExploded = 'bomb_exploded',
    StopWatch = 'stopwatch'
}

export interface WeakRoundOutcome {
    outcome?: Outcome,
    score: string
}

interface RoundOutcome extends WeakRoundOutcome {
    outcome: Outcome
}

export default RoundOutcome
