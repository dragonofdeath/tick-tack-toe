import React from 'react';
import { ExtendedMove } from './boardTypes';

type Props = {
    moveHistory: ExtendedMove[];
};

const MoveLog = ({ moveHistory }: Props) => (
    <pre>
        <h2>Move log</h2>
        <ol style={{ width: 300, margin: 'auto' }}>
            {moveHistory.map((move, index) => (
                <li key={index} style={{ textAlign: 'left' }}>
                    {move.player}: column #{move.column + 1}, row #{move.row + 1}
                </li>
            ))}
        </ol>
    </pre>
);

export default MoveLog;
