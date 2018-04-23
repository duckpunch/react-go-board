import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inRange, range, round} from 'lodash';
import go from 'godash';

function StarPoint(props) {
    const {radius, x, y} = props;
    return <circle cx={x} cy={y} r={radius} fill='#333' />
}

function Stone(props) {
    const {color, radius, x, y} = props;
    const fill = color === go.BLACK ? '#333' : '#fff';

    return <circle cx={x} cy={y} r={radius} fill={fill} filter='url(#shadow)' />;
}

function Annotation({radius, x, y}) {
    const sideLength = radius * Math.sqrt(3);
    const dx = sideLength / 2;
    const dy = Math.sqrt(3) * sideLength / 2 - radius;
    const points = [
        [x, y - radius].join(','),
        [x - dx, y + dy].join(','),
        [x + dx, y + dy].join(','),
    ].join(' ');

    return <polygon stroke='#999' points={points} fillOpacity={0}/>;
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
        this.annotationSize = this.stoneSize * 0.8;
    }

    boardToSVG(coordinate) {
        return {
            x: this.startPoint + coordinate.x * this.cellSize,
            y: this.startPoint + coordinate.y * this.cellSize,
        };
    }

    svgToBoard(x, y) {
        const coordinate = new go.Coordinate(
            round((x - this.startPoint) / this.cellSize),
            round((y - this.startPoint) / this.cellSize),
        );

        if (inRange(coordinate.x, 0, this.props.board.dimensions) &&
            inRange(coordinate.y, 0, this.props.board.dimensions)) {
            return coordinate;
        }

    }

    handleClick(event) {
        // Project points to SVG space
        const svgElement = event.currentTarget;
        const screenPoint = svgElement.createSVGPoint()
        screenPoint.x = event.clientX;
        screenPoint.y = event.clientY;
        const svgPoint = screenPoint.matrixTransform(svgElement.getScreenCTM().inverse());

        const coordinate = this.svgToBoard(svgPoint.x, svgPoint.y);
        if (this.props.onCoordinateClick && coordinate) {
            this.props.onCoordinateClick(coordinate);
        }
    }

    render() {
        const svgViewBox = `0 0 ${this.viewBox} ${this.viewBox}`;
        const boardColor = this.props.boardColor || '#fff';

        const starPoints = this.dimensions === 19 ? [
            new go.Coordinate(3, 3),
            new go.Coordinate(9, 3),
            new go.Coordinate(15, 3),
            new go.Coordinate(3, 9),
            new go.Coordinate(9, 9),
            new go.Coordinate(15, 9),
            new go.Coordinate(3, 15),
            new go.Coordinate(9, 15),
            new go.Coordinate(15, 15),
        ] : [];

        return (
            <svg viewBox={svgViewBox} onClick={this.handleClick.bind(this)}>
                <defs>
                    <filter id='shadow'>
                        <feDropShadow dx='0.5' dy='0.5' stdDeviation='1' floodColor='#666'/>
                    </filter>
                </defs>

                <rect x={this.boardMargin} y={this.boardMargin} fill={boardColor} filter='url(#shadow)'
                    width={this.viewBox - this.boardMargin * 2} height={this.viewBox - this.boardMargin * 2}/>

                {range(this.dimensions).map(index =>
                    <line key={'x' + index}
                        x1={this.startPoint + index * this.cellSize} x2={this.startPoint + index * this.cellSize}
                        y1={this.startPoint} y2={this.startPoint + this.boardSize - this.cellSize} stroke='#999'/>
                )}

                {range(this.dimensions).map(index =>
                    <line key={'y' + index}
                        y1={this.startPoint + index * this.cellSize} y2={this.startPoint + index * this.cellSize}
                        x1={this.startPoint} x2={this.startPoint + this.boardSize - this.cellSize} stroke='#999'/>
                )}

                {starPoints.map(
                    coordinate => <StarPoint {...this.boardToSVG(coordinate)}
                        radius={this.stoneSize / 4} key={'x:' + coordinate.x + ',y:' + coordinate.y} />
                )}

                {this.props.board.moves.map(
                    (color, coordinate) => <Stone color={color} {...this.boardToSVG(coordinate)} radius={this.stoneSize} key={'x:' + coordinate.x + ',y:' + coordinate.y}/>
                ).valueSeq()}

                {this.props.annotations && this.props.annotations.map(
                    (coordinate, index) => <Annotation key={'annotation' + index} {...this.boardToSVG(coordinate)} radius={this.annotationSize}/>
                )}
            </svg>
        );
    }
}

Goban.propTypes = {
    board: PropTypes.object.isRequired,
    onCoordinateClick: PropTypes.func,
    annotations: PropTypes.array,
    boardColor: PropTypes.string,
}
