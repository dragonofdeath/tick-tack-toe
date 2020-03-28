import React from 'react';
import { Player, Outcome, OutcomeType } from './boardTypes';

type Props = {
    activePlayer: Player;
    outcome: Outcome;
};

const GameStatus = ({ activePlayer, outcome }: Props) => (
    <h2 className="text-2xl pb-4">
        {(() => {
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
        })()}
    </h2>
);

export default GameStatus;
