import React, {Component, PropTypes} from 'react';
import {range} from 'lodash';
import go from 'godash';

function Stone(props) {
    const {color, radius, x, y} = props;
    const fill = color === go.BLACK ? '#333' : '#fff';

    console.log(props);

    return <circle cx={x} cy={y} r={radius} fill={fill} filter="url(#shadow)" />;
}

export class Goban extends Component {
    constructor(props) {
        super(props);

        this.viewBox = 500;
        this.boardMargin = 5;
        this.boardPadding = 5;
        this.totalMargin = this.boardPadding + this.boardMargin;
        this.boardSize = this.viewBox - 2 * this.totalMargin;

        this.dimensions = props.board.dimensions;
        this.cellSize = this.boardSize / this.dimensions;
        this.startPoint = this.totalMargin + this.cellSize / 2;
        this.stoneSize = this.cellSize / 2 - 3;
    }

    boardToSVG(coordinate) {
        return {
            x: this.startPoint + coordinate.x * this.cellSize,
            y: this.startPoint + coordinate.y * this.cellSize,
        };
    }

    svgToBoard(x, y) {
        // derp
    }

    render() {
        const svgViewBox = `0 0 ${this.viewBox} ${this.viewBox}`;

        return (
            <div className="App">
                <svg viewBox={svgViewBox}>
                    <defs>
                        <filter id="shadow">
                            <feDropShadow dx="0.5" dy="0.5" stdDeviation="1" floodColor="#666"/>
                        </filter>
                    </defs>

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

                    {this.props.board.moves.map(
                        (color, coordinate) => <Stone color={color} {...this.boardToSVG(coordinate)} radius={this.stoneSize} key={'x:' + coordinate.x + ',y:' + coordinate.y}/>
                    ).valueSeq()}
                </svg>
            </div>
        );
    }
}

Goban.propTypes = {
    board: PropTypes.object.isRequired,
    onCoordinateClick: PropTypes.func,
}

Goban.defaultProps = {
    onCoordinateClick: () => {},
}
