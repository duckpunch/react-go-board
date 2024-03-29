import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {flatten, inRange, range, round, toPairs} from 'lodash';
import go from 'godash';

function StarPoint({radius, x, y}) {
    return <circle cx={x} cy={y} r={radius} fill='#333' />
}

function Stone({color, radius, x, y}) {
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

    return <polygon stroke='#999' points={points} fillOpacity={0} />;
}

function Highlight({x, y, color, cellSize}) {
    const offset = cellSize / 2;
    return <rect x={x - offset} y={y - offset} fill={color}
        width={cellSize} height={cellSize}/>;
}

export class Goban extends Component {
    constructor(props) {
        super(props);

        this.dimensions = props.board.dimensions;

        this.viewBox = 500;

        this.showCoordinates = props.options.showCoordinates && this.dimensions <= 25;
        this.coordinatesSize = this.showCoordinates ? this.viewBox / this.dimensions / 3 : 0;

        this.boardMargin = 5;
        this.boardPadding = 5 + this.coordinatesSize;
        this.totalMargin = this.boardPadding + this.boardMargin;

        this.boardSize = this.viewBox - 2 * this.totalMargin;
        this.cellSize = this.boardSize / this.dimensions;

        this.startPoint = this.totalMargin + this.cellSize / 2;
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

    getSvgViewBox() {
        const lastIndex = this.dimensions - 1;
        const extra = this.totalMargin;
        const topLeft = this.props.topLeft === undefined ? {x: 0, y: 0} : this.props.topLeft;
        const bottomRight = this.props.bottomRight === undefined ? {
            x: lastIndex,
            y: lastIndex,
        } : this.props.bottomRight;

        let x, y, width, height;

        width = (bottomRight.x - topLeft.x + 1) * this.cellSize;
        height = (bottomRight.y - topLeft.y + 1) * this.cellSize;
        if (bottomRight.x === lastIndex) {
            width += extra;
        }

        if (bottomRight.y === lastIndex) {
            height += extra;
        }

        if (topLeft.x === 0) {
            x = 0;
            width += extra;
        } else {
            x = extra + topLeft.x * this.cellSize;
        }

        if (topLeft.y === 0) {
            y = 0;
            height += extra;
        } else {
            y = extra + topLeft.y * this.cellSize;
        }

        return `${x} ${y} ${width} ${height}`;
    }

    render() {
        const svgViewBox = this.getSvgViewBox();
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

        const options = this.props.options || {};

        const stonePadding = options.stonePadding || 6;
        const stoneSize = this.cellSize / 2 - stonePadding / 2;
        const annotationSize = stoneSize * 0.8;
        const coordinateLetters = "ABCDEFGHJKLMNOPQRSTUVWXYZ"

        return (
            <svg viewBox={svgViewBox} onClick={this.handleClick.bind(this)}>
                <defs>
                    <style>
                        {`
                        .coordinates {
                            font: bold ${this.coordinatesSize}px sans-serif;
                            dominant-baseline: central;
                            text-anchor: middle;
                        }
                        `}
                    </style>
                    <filter id='shadow'>
                        <feDropShadow dx='0.5' dy='0.5' stdDeviation='1' floodColor='#666'/>
                    </filter>
                </defs>

                // Board
                <rect x={this.boardMargin} y={this.boardMargin} fill={boardColor} filter='url(#shadow)'
                    width={this.viewBox - this.boardMargin * 2} height={this.viewBox - this.boardMargin * 2}/>

                // Coordinates
                {this.showCoordinates && range(this.dimensions).map(index =>
                    <text key={'c_left' + index} className="coordinates"
                        x={this.totalMargin - this.coordinatesSize / 2}
                        y={this.startPoint + index * this.cellSize}>
                            {index + 1}
                    </text>
                )}
                {this.showCoordinates && range(this.dimensions).map(index =>
                    <text key={'c_right' + index} className="coordinates"
                        x={this.viewBox - this.totalMargin + this.coordinatesSize / 2}
                        y={this.startPoint + index * this.cellSize}>
                            {index + 1}
                    </text>
                )}

                {this.showCoordinates && range(this.dimensions).map(index =>
                    <text key={'c_top' + index} className="coordinates"
                        x={this.startPoint + index * this.cellSize}
                        y={this.totalMargin - this.coordinatesSize / 2}>
                            {coordinateLetters[index]}
                    </text>
                )}
                {this.showCoordinates && range(this.dimensions).map(index =>
                    <text key={'c_bottom' + index} className="coordinates"
                        x={this.startPoint + index * this.cellSize}
                        y={this.viewBox - this.totalMargin + this.coordinatesSize / 2}>
                            {coordinateLetters[index]}
                    </text>
                )}

                // Highlights
                {this.props.highlights && flatten(toPairs(this.props.highlights).map(
                    ([color, coordinates]) => coordinates.map(coordinate =>
                        <Highlight {...this.boardToSVG(coordinate)}
                            key={`x,y,color:${coordinate.x},${coordinate.y},${color}`}
                            color={color} cellSize={this.cellSize}/>
                    )
                ))}

                // Grid
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

                // Star points
                {starPoints.map(
                    coordinate => <StarPoint {...this.boardToSVG(coordinate)}
                        radius={stoneSize / 4} key={'x:' + coordinate.x + ',y:' + coordinate.y} />
                )}

                // Stones
                {this.props.board.moves.map(
                    (color, coordinate) => <Stone color={color} {...this.boardToSVG(coordinate)} radius={stoneSize} key={'x:' + coordinate.x + ',y:' + coordinate.y}/>
                ).valueSeq()}

                // Annotations
                {this.props.annotations && this.props.annotations.map(
                    (coordinate, index) => <Annotation key={'annotation' + index} {...this.boardToSVG(coordinate)} radius={annotationSize}/>
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
    highlights: PropTypes.objectOf(
        PropTypes.arrayOf(PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        })),
    ),
    topLeft: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    bottomRight: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    options: PropTypes.shape({
        stonePadding: PropTypes.number,
        showCoordinates: PropTypes.bool,
    }),
}
