import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import boardReducer from './tick-tack-toe/boardSlice';

export const store = configureStore({
    reducer: {
        board: boardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
