import { times, always, F } from 'ramda';

import Vector from './Vector';

const offsets = [
    new Vector(-1, -1), new Vector(-1, 0), new Vector(-1, 1),
    new Vector(0, -1), /*               */ new Vector(0, 1),
    new Vector(1, -1), new Vector(1, 0), new Vector(1, 1)
];

export default class Board {
    constructor(state) {
        this.state = state;
    }

    map(f) {
        // bottleneck optimization
        const state = this.state;
        const size = state.length;
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
        const size = this.state.length;
        return this.state[(x + size) % size][(y + size) % size];
    }

    static empty(size) {
        return new Board(times(always(times(F)(size)))(size));
    }
}
