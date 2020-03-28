import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from './boardSlice';
import Board from './Board';
import MoveLog from './MoveLog';
import GameStatus from './GameStatus';

const TickTackToePage = () => {
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
        <div style={{ paddingTop: 50 }}>
            <h1>tick tack toe</h1>
            <GameStatus activePlayer={activePlayer} outcome={outcome} />
            <Board
                movesAllowed={movesAllowed}
                cells={cells}
                onCellClick={(columnIndex, rowIndex) => {
                    dispatch(actions.cellClicked(columnIndex, rowIndex));
                }}
            />
            <div>
                <button disabled={syncing} onClick={() => dispatch(actions.resetClicked())}>
                    Reset
                </button>
            </div>
            <MoveLog moveHistory={moveHistory} />
        </div>
    );
};

export default TickTackToePage;
