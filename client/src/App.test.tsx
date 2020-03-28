import React from 'react';
import { render, fireEvent, getByText as getByTextInContainer } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { Move } from './tick-tack-toe/boardTypes';
import { resetGame } from './tick-tack-toe/tickTackToeService';

jest.mock('./tick-tack-toe/tickTackToeService.ts', () => {
    let moves: Move[] = [];
    return {
        fetchMoveHistory: () => moves,
        pushMove: (move: Move) => {
            moves = [...moves, move];
        },
        resetGame: () => {
            moves = [];
        },
    };
});

describe('tick tack toe app', () => {
    beforeEach(() => {
        resetGame();
    });
    it('renders all required elements', () => {
        const { getByText, getAllByTestId } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        expect(getByText(/tick tack toe/i)).toBeInTheDocument();

        const cells = getAllByTestId(/cell/i);
        expect(cells.length).toBe(9);

        expect(getByText(/move log/i)).toBeInTheDocument();
    });

    it('shows correct turns and result for scenario when player X winds ', async () => {
        const { getAllByTestId, findByText, getByText } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        const cells = getAllByTestId(/cell/i);

        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[0]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[1]);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[2]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[3]);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[4]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[5]);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[6]);
        expect(await findByText('Game over: Player "X" won!')).toBeInTheDocument();

        expect(getByTextInContainer(cells[0], 'X')).toBeInTheDocument();
        expect(getByTextInContainer(cells[1], 'O')).toBeInTheDocument();
        expect(getByTextInContainer(cells[2], 'X')).toBeInTheDocument();
        expect(getByTextInContainer(cells[3], 'O')).toBeInTheDocument();
        expect(getByTextInContainer(cells[4], 'X')).toBeInTheDocument();
        expect(getByTextInContainer(cells[5], 'O')).toBeInTheDocument();
        expect(getByTextInContainer(cells[6], 'X')).toBeInTheDocument();
        expect(getByTextInContainer(cells[7], '')).toBeInTheDocument();
        expect(getByTextInContainer(cells[8], '')).toBeInTheDocument();

        const resetButton = getByText('RESET');
        fireEvent.click(resetButton);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
    });

    it('shows correct turns and result for scenario when player O winds ', async () => {
        const { getAllByTestId, findByText } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        const cells = getAllByTestId(/cell/i);

        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[0]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[1]);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[2]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[4]);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[5]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[7]);
        expect(await findByText('Game over: Player "O" won!')).toBeInTheDocument();
    });

    it('shows correct turns and result for scenario ending in draw', async () => {
        const { getAllByTestId, findByText } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        const cells = getAllByTestId(/cell/i);

        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[0]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[1]);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[2]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[4]);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[3]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[5]);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[7]);
        expect(await findByText('Player "O" turn')).toBeInTheDocument();
        fireEvent.click(cells[6]);
        expect(await findByText('Player "X" turn')).toBeInTheDocument();
        fireEvent.click(cells[8]);
        expect(await findByText('Game over: DRAW')).toBeInTheDocument();
    });
});
