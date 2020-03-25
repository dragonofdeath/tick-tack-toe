import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions, CellState } from './boardSlice';

const Cell = ({ cellState, onClick }: { cellState: CellState; onClick?: () => void }) => (
    <div
        onClick={onClick}
        style={{
            cursor: onClick ? 'pointer' : 'default',
            width: 100,
            height: 100,
            fontSize: 50,
            padding: 15,
            border: '2px solid black',
        }}
    >
        {
            {
                [CellState.X]: 'X',
                [CellState.O]: 'O',
                [CellState.EMPTY]: '',
            }[cellState]
        }
    </div>
);
const Board = () => {
    const { cells, syncing } = useSelector(selectors.boardViewState);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(actions.initBoard());
    }, [dispatch]);

    return (
        <div>
            <div style={{ border: '4px solid black', display: 'inline-block' }}>
                {cells.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex' }}>
                        {row.map((cellState, columnIndex) => (
                            <Cell
                                key={columnIndex}
                                cellState={cellState}
                                onClick={
                                    cellState === CellState.EMPTY && !syncing
                                        ? () => dispatch(actions.cellClicked(columnIndex, rowIndex))
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
            <button disabled={syncing} onClick={() => dispatch(actions.resetClicked())}>
                Reset
            </button>
        </div>
    );
};

export default Board;
