import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {range} from 'lodash'

function Stone(props) {
    const fill = props.color === 'black' ? '#333' : '#fff';
    return <circle cx={props.x} cy={props.y} r={props.radius} fill={fill} filter="url(#shadow)" />;
}

class App extends Component {
    constructor() {
        super();

        this.viewBox = 500;
        this.boardMargin = 5;
        this.boardPadding = 5;
        this.totalMargin = this.boardPadding + this.boardMargin;
        this.boardSize = this.viewBox - 2 * this.totalMargin;

        this.dimensions = 9; // get this from props
        this.cellSize = this.boardSize / this.dimensions;
        this.startPoint = this.totalMargin + this.cellSize / 2;
        this.stoneSize = this.cellSize / 2 - 3;
    }

    boardToSVG(x, y) {
        return [
            this.startPoint + x * this.cellSize,
            this.startPoint + y * this.cellSize,
        ];
    }

    svgToBoard(x, y) {
        // derp
    }

    render() {
        const svgViewBox = `0 0 ${this.viewBox} ${this.viewBox}`;

        const [x, y] = this.boardToSVG(3, 4);
        const [x1, y1] = this.boardToSVG(2, 4);
        const [x2, y2] = this.boardToSVG(3, 5);
        const [x3, y3] = this.boardToSVG(2, 5);

        return (
            <div className="App">
                <svg viewBox={svgViewBox}>
                    <defs>
                        <filter id="shadow">
                            <feDropShadow dx="0.5" dy="0.5" stdDeviation="1" floodColor="#666"/>
                        </filter>
                    </defs>

                    <rect x="0" y="0" width="500" height="500" stroke="#000" fill="none"/>

                    <rect x={this.boardMargin} y={this.boardMargin} fill="#eee" filter="url(#shadow)"
                        width={this.viewBox - this.boardMargin * 2} height={this.viewBox - this.boardMargin * 2}/>

                    {range(this.dimensions).map(index =>
                        <line key={'x' + index}
                            x1={this.startPoint + index * this.cellSize} x2={this.startPoint + index * this.cellSize}
                            y1={this.startPoint} y2={this.startPoint + this.boardSize - this.cellSize} stroke="#999"/>
                    )}

                    {range(this.dimensions).map(index =>
                        <line key={'y' + index}
                            y1={this.startPoint + index * this.cellSize} y2={this.startPoint + index * this.cellSize}
                            x1={this.startPoint} x2={this.startPoint + this.boardSize - this.cellSize} stroke="#999"/>
                    )}

                    <Stone x={x} y={y} radius={this.stoneSize} />
                    <Stone x={x1} y={y1} radius={this.stoneSize} />
                    <Stone x={x2} y={y2} radius={this.stoneSize} color="black" />
                    <Stone x={x3} y={y3} radius={this.stoneSize} />
                </svg>
            </div>
        );
    }
}

const propTypes = {
    board: '',
    onCoordinateClick: '',
}

export default App;



// WEBPACK FOOTER //
// src/App.js
