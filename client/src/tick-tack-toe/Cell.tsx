import React from 'react';
import { CellState, CellStateType } from './boardTypes';

type Props = {
    cellState: CellState;
    onClick?: () => void;
    testId: string;
};

const Cell = ({ cellState, onClick, testId }: Props) => {
    const cellText = cellState.type === CellStateType.EMPTY ? '' : cellState.player;
    return (
        <div
            onClick={onClick}
            data-testid={testId}
            className={`text-5xl p-4 border-2 border-black ${
                onClick ? 'cursor-pointer hover:bg-gray-200' : 'cursor-default'
            } ${cellState.type === CellStateType.USED_WINNING ? 'font-bold text-red-800' : 'font-normal'}`}
            style={{ width: 100, height: 100 }}
        >
            {cellText}
        </div>
    );
};

export default Cell;
