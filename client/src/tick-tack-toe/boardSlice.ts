import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

type BoardAction = {
    row: number;
    column: number;
};

type BoardState = {
    actionHistory: BoardAction[];
    actionPending: boolean;
};

const initialState: BoardState = {
    actionHistory: [],
    actionPending: false,
};

export const slice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        registerBoardActionPending: state => {
            state.actionPending = true;
        },
        registerBoardActionSuccess: (state, action: PayloadAction<BoardAction>) => {
            state.actionHistory.push(action.payload);
            state.actionPending = false;
        },
        initBoardActionHistoryPending: state => {
            state.actionPending = true;
        },
        initBoardActionHistorySuccess: (state, action: PayloadAction<BoardAction[]>) => {
            state.actionHistory = action.payload;
            state.actionPending = false;
        },
        restartGamePending: state => {
            state.actionPending = true;
        },
        restartGameSuccess: state => {
            state.actionHistory = [];
            state.actionPending = false;
        },
    },
});

export const {
    registerBoardActionPending,
    registerBoardActionSuccess,
    initBoardActionHistoryPending,
    initBoardActionHistorySuccess,
    restartGamePending,
    restartGameSuccess,
} = slice.actions;

const initBoard = (): AppThunk => (dispatch: Dispatch) => {
    dispatch(initBoardActionHistoryPending());
    setTimeout(() => {
        dispatch(initBoardActionHistorySuccess([]));
    }, 500);
};

const cellClicked = (column: number, row: number): AppThunk => (dispatch: Dispatch) => {
    dispatch(registerBoardActionPending());
    setTimeout(() => {
        dispatch(registerBoardActionSuccess({ row, column }));
    }, 500);
};

const resetClicked = (): AppThunk => (dispatch: Dispatch) => {
    dispatch(restartGamePending());
    setTimeout(() => {
        dispatch(restartGameSuccess());
    }, 500);
};

export const actions = {
    initBoard,
    cellClicked,
    resetClicked,
};

export enum CellState {
    EMPTY,
    X,
    O,
}

const BOARD_DIMENSIONS = {
    columns: 3,
    rows: 3,
};

export type BoardViewState = {
    cells: CellState[][];
    syncing: boolean;
};

export const selectors = {
    boardViewState: (state: RootState): BoardViewState => {
        const { actionHistory, actionPending } = state.board;
        const cells = Array(BOARD_DIMENSIONS.rows)
            .fill(null)
            .map((_r, rowIndex) =>
                Array(BOARD_DIMENSIONS.columns)
                    .fill(null)
                    .map((_c, columnIndex) => {
                        const correspondingActionIndex = actionHistory.findIndex(
                            action => action.row === rowIndex && action.column === columnIndex
                        );
                        if (correspondingActionIndex === -1) return CellState.EMPTY;
                        if (correspondingActionIndex % 2) return CellState.O;
                        return CellState.X;
                    })
            );
        return {
            cells,
            syncing: actionPending,
        };
    },
};

export default slice.reducer;
