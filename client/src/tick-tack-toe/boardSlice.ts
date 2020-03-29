import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import { range } from '../utils';
import { Move, ExtendedMove, Player, Outcome, OutcomeType, CellState, CellStateType } from './boardTypes';
import * as tickTackToeService from './tickTackToeService';

type BoardState = {
    moveHistory: Move[];
    syncing: boolean;
    error: boolean;
};

const initialState: BoardState = {
    moveHistory: [],
    syncing: false,
    error: false,
};

export const slice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        statePending: state => {
            state.syncing = true;
            state.error = false;
        },
        loadHistorySuccess: (state, action: PayloadAction<Move[]>) => {
            state.moveHistory = action.payload;
            state.syncing = false;
            state.error = false;
        },
        syncFailed: state => {
            state.error = true;
            state.syncing = false;
        },
    },
});

export const { statePending, loadHistorySuccess, syncFailed } = slice.actions;

const initBoard = (): AppThunk => async (dispatch: Dispatch) => {
    dispatch(statePending());
    try {
        const moveHistory = await tickTackToeService.fetchMoveHistory();
        dispatch(loadHistorySuccess(moveHistory));
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        dispatch(syncFailed());
    }
};

const cellClicked = (column: number, row: number): AppThunk => async (dispatch: Dispatch) => {
    dispatch(statePending());
    try {
        await tickTackToeService.pushMove({ column, row });
        const moveHistory = await tickTackToeService.fetchMoveHistory();
        dispatch(loadHistorySuccess(moveHistory));
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        dispatch(syncFailed());
    }
};

const resetClicked = (): AppThunk => async (dispatch: Dispatch) => {
    dispatch(statePending());
    try {
        await tickTackToeService.resetGame();
        const moveHistory = await tickTackToeService.fetchMoveHistory();
        dispatch(loadHistorySuccess(moveHistory));
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        dispatch(syncFailed());
    }
};

export const actions = {
    initBoard,
    cellClicked,
    resetClicked,
};

const checkForWinner = (moves: ExtendedMove[], lastMove: ExtendedMove): ExtendedMove[] | null => {
    const playerMoves = moves.filter(m => m.player === lastMove.player);
    const rowMoves = playerMoves.filter(m => m.row === lastMove.row);
    if (rowMoves.length === 3) return rowMoves;
    const columnMoves = playerMoves.filter(m => m.column === lastMove.column);
    if (columnMoves.length === 3) return columnMoves;

    const diagonalLRMoves = playerMoves.filter(m => m.row === m.column);
    if (diagonalLRMoves.length === 3) return diagonalLRMoves;

    const diagonalRLMoves = playerMoves.filter(m => m.column === 2 - m.row);
    if (diagonalRLMoves.length === 3) return diagonalRLMoves;

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

    error: (state: RootState) => state.board.error,

    activePlayer: (state: RootState) => (state.board.moveHistory.length % 2 ? Player.O : Player.X),

    movesAllowed: (state: RootState) =>
        !state.board.syncing && !state.board.error && selectors.outcome(state).type === OutcomeType.ONGOING,
};

export default slice.reducer;
