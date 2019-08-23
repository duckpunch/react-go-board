import React from 'react';
import ReactDOM from 'react-dom';
import {Goban} from './index';
import {Board, Coordinate, BLACK, WHITE} from 'godash';
import go from 'godash';

const board = new go.Board(19,
    new go.Coordinate(3, 4), go.BLACK,
    new go.Coordinate(4, 4), go.BLACK,
);
const highlights = {
    '#0ff': [{x: 4, y: 4}],
    '#ccc': [
        {x: 5, y: 4},
        {x: 6, y: 4},
        {x: 7, y: 4},
    ],
}
const topLeft = {x: 2, y: 4};
const bottomRight = {x: 5, y: 9};

ReactDOM.render(
    <Goban board={board} highlights={highlights}
        topLeft={topLeft} bottomRight={bottomRight}
        onCoordinateClick={c => console.log(c.toString())}/>,
    document.getElementById('root')
);
