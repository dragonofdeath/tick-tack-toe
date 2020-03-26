export enum CellStateType {
    EMPTY,
    USED,
    USED_WINNING,
}

export type CellState =
    | { type: CellStateType.EMPTY }
    | { type: CellStateType.USED | CellStateType.USED_WINNING; player: Player };

export enum Player {
    X = 'X',
    O = 'O',
}

export enum OutcomeType {
    ONGOING,
    END_BY_DRAW,
    END_WITH_WINNER,
}

export type Outcome =
    | { type: OutcomeType.ONGOING }
    | { type: OutcomeType.END_BY_DRAW }
    | { type: OutcomeType.END_WITH_WINNER; winner: Player; moves: Move[] };

export type Move = {
    row: number;
    column: number;
};

export type ExtendedMove = Move & {
    player: Player;
};
