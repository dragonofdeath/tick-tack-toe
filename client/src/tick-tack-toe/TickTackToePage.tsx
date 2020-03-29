import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from './boardSlice';
import Board from './Board';
import MoveLog from './MoveLog';
import GameStatus from './GameStatus';

const TickTackToePage = () => {
    const activePlayer = useSelector(selectors.activePlayer);
    const syncing = useSelector(selectors.syncing);
    const error = useSelector(selectors.error);
    const moveHistory = useSelector(selectors.moveHistory);
    const outcome = useSelector(selectors.outcome);
    const movesAllowed = useSelector(selectors.movesAllowed);
    const cells = useSelector(selectors.cells);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(actions.initBoard());
    }, [dispatch]);

    return (
        <div className="pt-10 text-center">
            <h1 className="text-6xl">tick tack toe</h1>
            {error ? (
                <h2 className="text-2xl pb-4 text-red-800">Error happened while syncing to server</h2>
            ) : (
                <GameStatus activePlayer={activePlayer} outcome={outcome} />
            )}
            <Board
                movesAllowed={movesAllowed}
                cells={cells}
                onCellClick={(columnIndex, rowIndex) => {
                    dispatch(actions.cellClicked(columnIndex, rowIndex));
                }}
            />
            <div className="mt-6 mb-10">
                <button
                    className="text-xl text-white bg-black px-4 py-2 rounded-sm hover:bg-gray-800"
                    disabled={syncing}
                    onClick={() => dispatch(actions.resetClicked())}
                >
                    RESET
                </button>
            </div>
            <MoveLog moveHistory={moveHistory} />
        </div>
    );
};

export default TickTackToePage;
