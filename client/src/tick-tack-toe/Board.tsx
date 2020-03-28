import React from 'react';
import { CellState, CellStateType } from './boardTypes';
import Cell from './Cell';

type Props = {
    movesAllowed: boolean;
    cells: CellState[][];
    onCellClick: (columnIndex: number, rowIndex: number) => void;
};

const Board = ({ movesAllowed, cells, onCellClick }: Props) => (
    <div
        className={`border-4 border-black rounded-sm inline-block ${
            movesAllowed ? 'opacity-1' : 'opacity-75'
        }`}
    >
        {cells.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
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
