import React from 'react';
import { ExtendedMove } from './boardTypes';

type Props = {
    moveHistory: ExtendedMove[];
};

const MoveLog = ({ moveHistory }: Props) => (
    <pre className="m-auto text-white bg-black rounded-sm p-4 text-left" style={{ width: 300 }}>
        <h2 className="font-bold mb-2">MOVE LOG</h2>
        {!moveHistory.length ? (
            'No moves where done yet'
        ) : (
            <ol>
                {moveHistory.map((move, index) => (
                    <li key={index}>
                        {move.player}: column #{move.column + 1}, row #{move.row + 1}
                    </li>
                ))}
            </ol>
        )}
    </pre>
);

export default MoveLog;
