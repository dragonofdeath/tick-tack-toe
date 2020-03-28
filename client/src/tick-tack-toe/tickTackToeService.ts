import { Move } from './boardTypes';
import { post } from '../utils';

export const fetchMoveHistory = (): Promise<Move[]> => {
    console.log('fetchMoveHistory');
    return fetch('/api/actions/list').then(response => response.json());
}

export const pushMove = (move: Move): Promise<void> => post('/api/actions/new', move);

export const resetGame = (): Promise<void> => post('/api/actions/clear');
