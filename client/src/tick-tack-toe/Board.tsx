import React from 'react';
import { CellState, CellStateType } from './boardTypes';
import Cell from './Cell';

type Props = {
    movesAllowed: boolean;
    cells: CellState[][];
    onCellClick: (columnIndex: number, rowIndex: number) => void;
};

const Board = ({ movesAllowed, cells, onCellClick }: Props) => (
    <div style={{ border: '4px solid black', display: 'inline-block', opacity: movesAllowed ? 1 : 0.7 }}>
        {cells.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
                {row.map((cellState, columnIndex) => (
                    <Cell
                        key={columnIndex}
                        cellState={cellState}
                        onClick={
                            cellState.type === CellStateType.EMPTY && movesAllowed
                                ? () => onCellClick(columnIndex, rowIndex)
                                : undefined
                        }
                        testId={`cell-${columnIndex}${rowIndex}`}
                    />
                ))}
            </div>
        ))}
    </div>
);

export default Board;
