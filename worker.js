'use strict';
import { empty, pipe, map, times, chain, F, always, compose } from 'ramda';

import { IO } from 'ramda-fantasy';

const size = 400;

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    concat(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }

    isInBounds() {
        return this.x >= 0 && this.y >= 0 &&
            this.x < size && this.y < size;
    }
}

const offsets = [
    new Vector(-1, -1), new Vector(-1, 0), new Vector(-1, 1),
    new Vector(0, -1), /*               */ new Vector(0, 1),
    new Vector(1, -1), new Vector(1, 0), new Vector(1, 1)
];

class Board {
    constructor(state) {
        this.state = state;
    }

    map(f) {
        // bottleneck optimization
        const state = this.state;
        let result = Array(size);
        let x = -1;
        let y = -1;
        let v;
        while (++x < size){
            result[x] = Array(size);
            while(++y < size){
                v = new Vector(x, y);
                result[x][y] = f(this.get(v), v, this);
            }
            y = -1;
        }
        return new Board(result);
    }

    countNeightboards(vec) {
        // bottleneck optimization
        let i = -1;
        const length = offsets.length;
        let result = 0;
        while(++i < length){
            if (this.get(offsets[i].concat(vec))) {
                ++result;
            }
        }
        return result;
    }

    get({ x, y }) {
        return this.state[(x + size) % size][(y + size) % size];
    }

    static empty() {
        return new Board(times(always(times(F)(size)))(size));
    }
}

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
    this.postMessage(board.state)
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
