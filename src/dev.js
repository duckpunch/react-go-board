import React from 'react';
import ReactDOM from 'react-dom';
import {Goban} from './index';
import go from 'godash';

const board = new go.Board(19,
    new go.Coordinate(0, 3), go.BLACK,
    new go.Coordinate(8, 0), go.WHITE,
    new go.Coordinate(3, 4), go.BLACK,
    new go.Coordinate(4, 4), go.WHITE,
);
const highlights = {
    '#0ff': [{x: 4, y: 4}],
    '#ccc': [
        {x: 5, y: 4},
        {x: 6, y: 4},
        {x: 7, y: 4},
    ],
}
const topLeft = {x: 0, y: 0};
const bottomRight = {x: 9, y: 7};

ReactDOM.render(
    <Goban board={board} highlights={highlights}
        topLeft={topLeft} bottomRight={bottomRight}
        options={{ showCoordinates: true }}
        onCoordinateClick={c => console.log(c.toString())}/>,
    document.getElementById('root')
);
