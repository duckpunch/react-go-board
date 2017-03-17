import React from 'react';
import ReactDOM from 'react-dom';
import {Goban} from './index';
import {Board, Coordinate, BLACK, WHITE} from 'godash';
import go from 'godash';

const board = new go.Board(19,
    new go.Coordinate(3, 4), go.BLACK,
);

ReactDOM.render(
    <Goban board={board} onCoordinateClick={c => console.log(c.toString())}/>,
    document.getElementById('root')
);
