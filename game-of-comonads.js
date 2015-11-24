'use strict';
import { IO } from 'ramda-fantasy';
import { size, scale } from './config';

const element = document.getElementById('game-of-comonads');
const canvas = element.getContext('2d');

import Vector from './Vector';
import Board from './Board';

const setup = new IO(() => {
    element.width = size * scale;
    element.height = size * scale;
    canvas.scale(scale, scale);
});

const drawBoard = board => new IO(() => {
    canvas.clearRect(0, 0, size, size);
    board.map((v, { x, y }) => v && canvas.fillRect(x, y, 1, 1))
});

setup.runIO();

const worker = new Worker('./worker-bundle.js');
worker.addEventListener('message', state => {
    drawBoard(new Board(state.data)).runIO()
});
