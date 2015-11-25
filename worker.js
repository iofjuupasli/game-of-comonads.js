'use strict';
import most from 'most';
import { unary, empty, pipe, map, times, chain, F, always, compose } from 'ramda';

import Vector from './Vector';
import Board from './Board';

const size$ = most.create(add => {
    add(100);
    const handler = e => add(e.data);
    addEventListener('message', handler);
    return () => removeEventListener('message', handler);
});

const rules = (c, vec, board) => {
    switch (board.countNeightboards(vec)) {
        case 2:
            return c;
        case 3:
            return true;
        default:
            return false;
    }
}

const generateBoard = pipe(
    Board.empty,
    map(() => Math.random() > 0.5)
);

const emitNewState = board => postMessage(board.state);

size$
    .map(generateBoard)
    .map(board =>
        most.periodic(0, true)
            .scan(unary(map(rules)), board)
    )
    .switch()
    .forEach(emitNewState)
