import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import { range } from '../utils';
import { Move, ExtendedMove, Player, Outcome, OutcomeType, CellState, CellStateType } from './boardTypes';

type BoardState = {
    moveHistory: Move[];
    syncing: boolean;
};

const initialState: BoardState = {
    moveHistory: [],
    syncing: false,
};

export const slice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        registerMovePending: state => {
            state.syncing = true;
        },
        registerMoveSuccess: (state, action: PayloadAction<Move>) => {
            state.moveHistory.push(action.payload);
            state.syncing = false;
        },
        initMoveHistoryPending: state => {
            state.syncing = true;
        },
        initMoveHistorySuccess: (state, action: PayloadAction<Move[]>) => {
            state.moveHistory = action.payload;
            state.syncing = false;
        },
        restartGamePending: state => {
            state.syncing = true;
        },
        restartGameSuccess: state => {
            state.moveHistory = [];
            state.syncing = false;
        },
    },
});

export const {
    registerMovePending,
    registerMoveSuccess,
    initMoveHistoryPending,
    initMoveHistorySuccess,
    restartGamePending,
    restartGameSuccess,
} = slice.actions;

const initBoard = (): AppThunk => (dispatch: Dispatch) => {
    dispatch(initMoveHistoryPending());
    setTimeout(() => {
        dispatch(initMoveHistorySuccess([]));
    }, 100);
};

const cellClicked = (column: number, row: number): AppThunk => (dispatch: Dispatch) => {
    dispatch(registerMovePending());
    setTimeout(() => {
        dispatch(registerMoveSuccess({ row, column }));
    }, 100);
};

const resetClicked = (): AppThunk => (dispatch: Dispatch) => {
    dispatch(restartGamePending());
    setTimeout(() => {
        dispatch(restartGameSuccess());
    }, 100);
};

export const actions = {
    initBoard,
    cellClicked,
    resetClicked,
};

const checkForWinner = (moves: ExtendedMove[], lastMove: ExtendedMove): ExtendedMove[] | null => {
    const playerMoves = moves.filter(a => a.player === lastMove.player);
    const rowMoves = playerMoves.filter(a => a.row === lastMove.row);
    if (rowMoves.length === 3) return rowMoves;
    const columnMoves = playerMoves.filter(a => a.column === lastMove.column);
    if (columnMoves.length === 3) return columnMoves;

    const diagonalLRMoves = playerMoves.filter(a => a.row === a.column);
    if (diagonalLRMoves.length === 3) return diagonalLRMoves;

    const diagonalRLMoves = playerMoves.filter(a => a.column === 2 - a.row);
    if (diagonalRLMoves.length === 3) return diagonalLRMoves;

    return null;
};

export const selectors = {
    moveHistory: (state: RootState): ExtendedMove[] => {
        const { moveHistory: rawMoveHistory } = state.board;

        return rawMoveHistory.map(({ row, column }, index) => ({
            row,
            column,
            player: index % 2 ? Player.O : Player.X,
        }));
    },

    outcome: (state: RootState): Outcome => {
        const actionHistory = selectors.moveHistory(state);
        const lastMove = actionHistory.slice(-1)[0];
        if (!lastMove) {
            return { type: OutcomeType.ONGOING };
        }
        const winningMoves = checkForWinner(actionHistory, lastMove);
        if (winningMoves) {
            return {
                type: OutcomeType.END_WITH_WINNER,
                winner: lastMove.player,
                moves: winningMoves,
            };
        }
        if (actionHistory.length === 3 * 3) {
            return { type: OutcomeType.END_BY_DRAW };
        }
        return { type: OutcomeType.ONGOING };
    },

    cells: (state: RootState): CellState[][] => {
        const moveHistory = selectors.moveHistory(state);
        const outcome = selectors.outcome(state);
        const winningMoves = outcome.type === OutcomeType.END_WITH_WINNER ? outcome.moves : [];
        return range(0, 3).map(rowIndex =>
            range(0, 3).map((_c, columnIndex) => {
                const correspondingMove = moveHistory.find(
                    action => action.row === rowIndex && action.column === columnIndex
                );
                if (!correspondingMove) return { type: CellStateType.EMPTY };
                if (winningMoves.find(move => move.row === rowIndex && move.column === columnIndex)) {
                    return {
                        type: CellStateType.USED_WINNING,
                        player: correspondingMove.player,
                    };
                }
                return {
                    type: CellStateType.USED,
                    player: correspondingMove.player,
                };
            })
        );
    },

    syncing: (state: RootState) => state.board.syncing,

    activePlayer: (state: RootState) => (state.board.moveHistory.length % 2 ? Player.O : Player.X),

    movesAllowed: (state: RootState) =>
        !state.board.syncing && selectors.outcome(state).type === OutcomeType.ONGOING,
};

export default slice.reducer;
