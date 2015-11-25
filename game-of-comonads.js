'use strict';
import most from 'most';
import { construct, map, forEach, pipe, chain } from 'ramda';
import { size$, scale$ } from './config';

const element = document.getElementById('game-of-comonads');
const canvas = element.getContext('2d');

import Vector from './Vector';
import Board from './Board';

const setup = ([size, scale]) => {
    element.width = size * scale;
    element.height = size * scale;
    canvas.scale(scale, scale);
};

const setup$ = most
    .combine((size, scale) => [size, scale], size$, scale$)
    .tap(setup);

const drawBoard = board => {
    const size = board.state.length;
    canvas.clearRect(0, 0, size, size);
    board.map((v, { x, y }) => v && canvas.fillRect(x, y, 1, 1));
};

const createWorker = ([size, scale]) => {
    return most.create(add => {
        const worker = new Worker('./worker-bundle.js');
        worker.addEventListener('message', e => add(e.data));
        worker.postMessage(size);
        return () => worker.terminate();
    });
};

pipe(
    map(createWorker),
    s => s.switch(),
    map(construct(Board)),
    forEach(drawBoard)
)(setup$);
