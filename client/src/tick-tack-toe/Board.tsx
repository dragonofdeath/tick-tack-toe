import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from './boardSlice';
import { CellState, CellStateType, Player, Outcome, OutcomeType } from './boardTypes';

const Cell = ({ cellState, onClick }: { cellState: CellState; onClick?: () => void }) => {
    const cellText = cellState.type === CellStateType.EMPTY ? '' : cellState.player;
    return (
        <div
            onClick={onClick}
            style={{
                cursor: onClick ? 'pointer' : 'default',
                width: 100,
                height: 100,
                fontSize: 50,
                padding: 15,
                border: '2px solid black',
                fontWeight: cellState.type === CellStateType.USED_WINNING ? 800 : 400,
            }}
        >
            {cellText}
        </div>
    );
};

const getGameStatusText = (activePlayer: Player, outcome: Outcome) => {
    switch (outcome.type) {
        case OutcomeType.ONGOING:
            return `Player "${activePlayer}" turn`;
        case OutcomeType.END_BY_DRAW:
            return 'Game over: DRAW';
        case OutcomeType.END_WITH_WINNER:
            return `Game over: Player "${outcome.winner}" won!`;
        default:
            throw new Error('Unknown outcome');
    }
};

const Board = () => {
    const activePlayer = useSelector(selectors.activePlayer);
    const syncing = useSelector(selectors.syncing);
    const moveHistory = useSelector(selectors.moveHistory);
    const outcome = useSelector(selectors.outcome);
    const movesAllowed = useSelector(selectors.movesAllowed);
    const cells = useSelector(selectors.cells);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(actions.initBoard());
    }, [dispatch]);

    return (
        <div>
            <h1>{getGameStatusText(activePlayer, outcome)}</h1>
            <div style={{ border: '4px solid black', display: 'inline-block' }}>
                {cells.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex' }}>
                        {row.map((cellState, columnIndex) => (
                            <Cell
                                key={columnIndex}
                                cellState={cellState}
                                onClick={
                                    cellState.type === CellStateType.EMPTY && movesAllowed
                                        ? () => dispatch(actions.cellClicked(columnIndex, rowIndex))
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div>
                <button disabled={syncing} onClick={() => dispatch(actions.resetClicked())}>
                    Reset
                </button>
            </div>
            <div>
                <h2>Move log</h2>
                <ul>
                    {moveHistory.map((move, index) => (
                        <li key={index}>
                            {move.player}: column #{move.column + 1}, row #{move.row + 1}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Board;
