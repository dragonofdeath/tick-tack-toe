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

export default Cell;
