'use strict';
import { empty, pipe, map, times, chain, F, always, compose } from 'ramda';

import { IO } from 'ramda-fantasy';
import { size } from './config';

import Vector from './Vector';
import Board from './Board';

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

const fork = io => new IO(() =>
    setTimeout(() => io.runIO(), 0)
);

const generateBoard = new IO(() =>
    pipe(
        empty,
        map(() => Math.random() > 0.5)
    )(Board)
);

const emitNewState = board => new IO(() =>
    postMessage(board.state)
);

const loop = board =>
    pipe(
        emitNewState,
        map(always(board)),
        map(map(rules)),
        chain(pipe(loop, fork))
    )(board);

const main = pipe(
    chain(loop)
)(generateBoard);

main.runIO();
